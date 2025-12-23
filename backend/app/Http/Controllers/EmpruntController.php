<?php

namespace App\Http\Controllers;

use App\Models\DETAIL_EMPRUNT;
use App\Models\EMPRUNT;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class EmpruntController extends Controller
{
    
        /**
 * @group Emprunts
 * Get a list of emprunts.
 *
 * @queryParam page int optional The page number.
 * @queryParam per_page int optional The number of items per page.
 */
    public function index(Request $request)
    {
        $etudiant  = $request->query('etudiant');  
        $date = $request->query('date');
        $query = EMPRUNT::query();
        if ($date) {
            try {
                $query->whereDate('created_at', $date);
            } catch (\Exception $e) {
                return response()->json([
                    'message' => 'Failed to filter emprunts by date',
                    'error' => $e->getMessage()
                ], 500);
            }
        }
        if ($etudiant) {
            try {
            $etudiant_id = DB::table('etudiants')->where('nom', 'like', "%{$etudiant}%")->pluck('id');
            $query->where('etudiant_id', $etudiant_id);   
            } catch (\Exception $e) {
                return response()->json([
                    'message' => 'Failed to filter emprunts by etudiant',
                    'error' => $e->getMessage()
                ], 500);
            }
        }

        return response()->json($query->with('details')->paginate(10), 200);
    }
    public function show($id)
    {
        if (!EMPRUNT::where('id', $id)->exists()) {
            return response()->json(['message' => 'Emprunt not found'], 404);
        }
        return EMPRUNT::with('details')->find($id);
    }

/**
 * @group Emprunts
 * Create a new emprunt.
 *
 * @bodyParam etudiant_id int required The ID of the etudiant.
 * @bodyParam details_emprunt array required The details of the emprunt.
 * @bodyParam details_emprunt.*.livre_id int required The ID of the livre.
 * @bodyParam details_emprunt.*.qte_emp int required The quantity emprunted.
 * 
 */
    public function store(Request $request)
    {
        $request->validate([
            'etudiant_id' => 'required|exists:etudiants,id',
            'details_emprunt' => 'required|array|min:1',
            'details_emprunt.*.livre_id' => 'required|exists:livres,id',
            'details_emprunt.*.qte_emp' => 'required|integer|min:1',
        ]);

        if ($request->input('details_emprunt') === null) {
            return response()->json(['message' => 'details_emprunt is required'], 400);
        }

        if (Auth::id() === null) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }
        $empruntData = [
            'etudiant_id' => $request->input('etudiant_id'),
            'user_id' => Auth::id(), 
        ];
        try {
            $detail_emprunt = $request->input('details_emprunt');
            $livres_ids = array_column($detail_emprunt, 'livre_id');
            $livres = \App\Models\LIVRE::whereIn('id', $livres_ids)->get()->keyBy('id');
            foreach ($detail_emprunt as $detail) {
                $livre = $livres->get($detail['livre_id']);
                if ($livre) {
                    if ($livre->quantite < $detail['qte_emp']) {
                        return response()->json(['message' => 'Not enough quantity for book ID: ' . $livre->id], 400);
                    }
                    $livre->quantite -= $detail['qte_emp'];
                    $livre->save();
                }
            }

            $emprunt = EMPRUNT::create($empruntData);

            foreach ($detail_emprunt as $detail) {
                $emprunt->details()->create($detail);
            }
            return response()->json($emprunt, 201);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to create emprunt',
                'error' => $e->getMessage()
            ], 500);
        }
    }

/**
 * @group Emprunts
 * Update an existing emprunt.
 *
 * @bodyParam etudiant_id int optional The ID of the etudiant.
 * @bodyParam details_emprunt array optional The details of the emprunt.
 * @bodyParam details_emprunt.*.livre_id optional int required The ID of the livre.
 * @bodyParam details_emprunt.*.qte_emp int optional required The quantity emprunted.
 *
 */
    public function update(Request $request, $id)
    {
        $request->validate([
            'etudiant_id' => 'exists:etudiants,id|optional',
            'details_emprunt' => 'array|min:1|optional',
            'details_emprunt.*.livre_id' => 'exists:livres,id|optional',
            'details_emprunt.*.qte_emp' => 'integer|min:1|optional',
        ]);
        if (!EMPRUNT::where('id', $id)->exists()) {
            return response()->json(['message' => 'Emprunt not found'], 404);
        }
        $emprunt = EMPRUNT::find($id);
        $empruntDetails = $request->input('details_emprunt', []);
        if (!empty($empruntDetails)) {
            foreach ($empruntDetails as $detail) {
                $existingDetail = DETAIL_EMPRUNT::where('emprunt_id', $emprunt->id)
                    ->where('livre_id', $detail['livre_id'])
                    ->first();
                if ($existingDetail) {
                    $existingDetail->update($detail);
                } else {
                    $emprunt->details()->create($detail);
                }
            }
        }
        $emprunt->update($request->all());

        return response()->json($emprunt, 200);
    }

    /**
     * Delete an existing emprunt.
     *
     * @response 204
     */
    public function destroy($id)
    {
        if (!EMPRUNT::where('id', $id)->exists()) {
            return response()->json(['message' => 'Emprunt not found'], 404);
        }
        $emprunt = EMPRUNT::find($id);
        $emprunt->delete();
        return response()->json(['message' => 'Emprunt deleted successfully'], 200);
    }
}
