<?php

namespace App\Http\Controllers;

use App\Models\RETARD;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

use function Symfony\Component\Clock\now;

class RetardController extends Controller
{
    /**
     * @group Retards
     * Get a list of retards.
     */
    public function index(Request $request)
    {
        $search = $request->query('search');
        $query = RETARD::query();
        
        if($search){
           $etudiant_ids = DB::table('etudiants')->where('nom', 'like', "%{$search}%")->pluck('id');
           $query->whereIn('etudiant_id', $etudiant_ids);
            $query->where(function($q) use ($search) {
                $q->where('etudiant_id', 'like', "%{$search}%");
            });
        }
        return response()->json(RETARD::paginate(10), 200);
    }
    /**
     * @group Retards
     * Get  retards by id.
     */
    public function show($id)
    {
        if (!RETARD::where('id', $id)->exists()) {
            return response()->json(['message' => 'Retard not found'], 404);
        }
        return response()->json(RETARD::find($id), 200);
    }
  /**
 * @group Retards
 * Create a new retard.
 *
 * @bodyParam emprunt_id integer required The ID of the emprunt. Example: 1
 * @bodyParam date_retard date required The date of the retard (YYYY-MM-DD). Example: 2025-12-01
 * @bodyParam montant number required The amount of the retard. Example: 50.00
 *
 * @response 201 {
 *   "id": 1,
 *   "emprunt_id": 1,
 *   "date_retard": "2025-12-01",
 *   "montant": 50.00,
 *   "created_at": "2025-12-01T12:00:00.000000Z",
 *   "updated_at": "2025-12-01T12:00:00.000000Z"
 * }
 * @response 400 {
 *   "message": "details_emprunt is required"
 * }
 * @response 500 {
 *   "message": "Failed to create retard"
 * }
 */
    public function store(Request $request)
    {
        $request->validate([
            'emprunt_id' => 'required|integer|exists:emprunts,id',
            'date_retard' => 'required|date',
            'montant' => 'required|numeric',
        ]);
        $montant = (date($request->input('date_retard')) - now()->format('Y-m-d') ) * 5;
        $request->merge(['montant' => $montant]);
        try {
            $retard = RETARD::create($request->all());
            return response()->json($retard, 201);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Failed to create retard'], 500);
        }
    }

/**
     * @group Retards
     * Update a specific retard.
     *
     * @urlParam id integer required The ID of the retard. Example: 1
     * @bodyParam emprunt_id integer The ID of the emprunt. Example: 1
     * @bodyParam date_retard date The date of the retard (YYYY-MM-DD). Example: 2025-12-01
     * @bodyParam montant number The amount of the retard. Example: 50.00
     *
     * @response 200 {
     *   "id": 1,
     *   "emprunt_id": 1,
     *   "date_retard": "2025-12-01",
     *   "montant": 60.00,
     *   "created_at": "2025-12-01T12:00:00.000000Z",
     *   "updated_at": "2025-12-02T12:00:00.000000Z"
     * }
     * @response 404 {
     *   "message": "Retard not found"
     * }
     */

    public function update(Request $request, $id)
    {
        $request->validate([
            'emprunt_id' => 'integer|exists:emprunts,id|optional',
            'date_retard' => 'date|optional',
            'montant' => 'numeric|optional',
        ]);
        if (!RETARD::where('id', $id)->exists()) {
            return response()->json(['message' => 'Retard not found'], 404);
        }
        $retard = RETARD::find($id);
        $retard->update($request->all());
        return response()->json($retard, 200);
    }
     /**
     * @group Retards
     * Delete a specific retard.
     *
     * @urlParam id integer required The ID of the retard. Example: 1
     *
     * @response 200 {
     *   "message": "Retard deleted successfully"
     * }
     * @response 404 {
     *   "message": "Retard not found"
     * }
     */
    public function destroy($id)
    {
        if(!RETARD::where('id', $id)->exists()){
            return response()->json(['message' => 'Retard not found'], 404);
        }
        $retard = RETARD::find($id);
        $retard->delete();
        return response()->json(['message' => 'Retard deleted successfully'], 200);
    }

}
