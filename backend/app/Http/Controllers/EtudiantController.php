<?php

namespace App\Http\Controllers;

use App\Models\ETUDIANT;
use Illuminate\Http\Request;

class EtudiantController extends Controller
{
    /**
     * @group Etudiants
     * Get a list of etudiants.
     */
    public function index(Request $request)
    {
        $search = $request->query('search');
        $query = ETUDIANT::query();

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('nom', 'like', "%{$search}%")
                    ->orWhere('prenom', 'like', "%{$search}%")
                    ->orWhere('filiere', 'like', "%{$search}%")
                    ->orWhere('niveau', 'like', "%{$search}%");
            });
        }

        return response()->json($query->paginate(10), 200);
    }
    /**
     * @group Etudiants
     * Get a specific etudiant.
     */
    public function show($id)
    {
        if (!ETUDIANT::where('id', $id)->exists()) {
            return response()->json(['message' => 'Etudiant not found'], 404);
        }
        return response()->json(ETUDIANT::find($id), 200);
    }
    /**
     * @group Etudiants
     * Create a new etudiant.
     * @bodyParam nom string required The last name of the etudiant.
     * @bodyParam prenom string required The first name of the etudiant.
     * @bodyParam filiere string required The field of study of the etudiant.
     * @bodyParam niveau string required The level of the etudiant.
     */
    public function store(Request $request)
    {
        try {
            $request->validate([
                'nom' => 'required|string|max:255',
                'prenom' => 'required|string|max:255',
                'filiere' => 'required|string|max:255',
                'niveau' => 'required|string|max:255',

            ]);
            $request->merge(['user_id' => auth()->id()]);
            $etudiant = ETUDIANT::create($request->all());
            return response()->json($etudiant, 201);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to create etudiant',
                'error' => $e->getMessage()
            ], 500);
        }
    }
    /**
     * @group Etudiants
     * Update a specific etudiant.
     * @bodyParam nom string The last name of the etudiant.
     * @bodyParam prenom string The first name of the etudiant.
     * @bodyParam filiere string The field of study of the etudiant.
     * @bodyParam niveau string The level of the etudiant.
     */
    public function update(Request $request, $id)
    {
        $request->validate([
            'nom' => 'string|max:255|optional',
            'prenom' => 'string|max:255|optional',
            'filiere' => 'string|max:255|optional',
            'niveau' => 'string|max:255|optional',
        ]);
        if (!ETUDIANT::where('id', $id)->exists()) {
            return response()->json(['message' => 'Etudiant not found'], 404);
        }
        $etudiant = ETUDIANT::find($id);
        $etudiant->update($request->all());
        return response()->json($etudiant, 200);
    }
    /**
     * @group Etudiants
     * Delete a specific etudiant.
     */
    public function destroy($id)
    {
        if (!ETUDIANT::where('id', $id)->exists()) {
            return response()->json(['message' => 'Etudiant not found'], 404);
        }
        $etudiant = ETUDIANT::find($id);
        $etudiant->delete();
        return response()->json(['message' => 'Etudiant deleted successfully'], 200);
    }
}
