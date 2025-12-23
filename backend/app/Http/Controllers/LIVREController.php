<?php

namespace App\Http\Controllers;

use App\Models\LIVRE;
use Illuminate\Http\Request;

class LIVREController extends Controller
{
    /**
     * @group Livres
     * Get a list of livres.
     * You can filter by genre, author, or search term using query parameters:
     * - genre: Filter livres by genre.
     * - author: Filter livres by author.
     * - search: Search livres by title, author, or genre.
     * - annee: Filter livres by publication year.
     * - isbn: Filter livres by ISBN.
     * - status: Filter livres by availability status ('enStock' or 'epuise').
     * - sort_by_date: Sort livres by publication date ('recent' or 'oldest').
     * @example /api/v1/livres?genre=Science%20Fiction&author=Isaac%20Asimov&search=Foundation
     * 
     */
    public function index(Request $request)
    {
        $genre  = $request->query('genre');     
        $author = $request->query('author');
        $search = $request->query('search');
        $annee = $request->query('annee');
        $isbn = $request->query('isbn');
        $status = $request->query('status');
        $recent_or_oldest = $request->query('sort_by_date');

        $query = LIVRE::query();
        if ($genre) {
            $query->where('genre', $genre);
        }
        if($annee){
            $query->whereYear('annee', $annee);
        }
        if($isbn){
            $query->where('isbn', $isbn);
        }
        if($recent_or_oldest){
            if($recent_or_oldest == 'recent'){
                $query->orderBy('created_at', 'desc');
            } elseif($recent_or_oldest == 'oldest'){
                $query->orderBy('created_at', 'asc');
            }
        }
        if($status){
            if($status == 'enStock'){
                $query->where('quantite', '>', 0);
            } elseif($status == 'epuise'){
                $query->where('quantite', '=', 0);
            }
        }


        if ($author) {
            $query->where('auteur', $author);
        }

        if ($search) {
            $query->where(function($q) use ($search) {
                $q->where('titre', 'like', "%{$search}%")
                  ->orWhere('auteur', 'like', "%{$search}%")
                  ->orWhere('genre', 'like', "%{$search}%")
                  ->orWhere('isbn', 'like', "%{$search}%")
                  ->orWhereYear('annee', 'like', "%{$search}%");
            });
        }

        return response()->json($query->paginate(10), 200);
    }

    /**
     * @group Livres
     * Get a specific livre.
     */
    public function show($id)
    {
        if(!LIVRE::where('id', $id)->exists()){
            return response()->json(['message' => 'Livre not found'], 404);

        }
        return response()->json(LIVRE::find($id), 200);
    }
    /**
     * @group Livres
     * Create a new livre.
     * 
     * @bodyParam titre string required The title of the livre.
     * @bodyParam auteur string required The author of the livre.
     * @bodyParam annee date required The publication year of the livre.
     * @bodyParam genre string required The genre of the livre.
     * @bodyParam isbn string required The ISBN of the livre.
     * @bodyParam quantite integer required The quantity of the livre.
     */
    public function store(Request $request)
    {
        $request->validate([
            'titre'=>'required|string|max:255',
            'auteur'=>'required|string|max:255',
            'annee'=>'required|date',
            'genre'=>'required|string|max:255',
            'isbn'=>'required|string|max:255',
            'quantite'=>'required|integer',
        ]);

        try {
            $livre = LIVRE::create($request->all());
            return response()->json($livre, 201);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Failed to create livre'], 500);
        }

    }
    /**
     * @group Livres
     * Update a specific livre.
     * 
     * @bodyParam titre string The title of the livre.
     * @bodyParam auteur string The author of the livre.
     * @bodyParam annee date The publication year of the livre.
     * @bodyParam genre string The genre of the livre.
     * @bodyParam isbn string The ISBN of the livre.
     * @bodyParam quantite integer The quantity of the livre.
     */
    public function update(Request $request, $id)
    {
        $request->validate([
            'titre' => 'string|max:255|optional',
            'auteur' => 'string|max:255|optional',
            'annee' => 'date|optional',
            'genre' => 'string|max:255|optional',
            'isbn' => 'string|max:255|optional',
            'quantite' => 'integer|optional',
        ]);
        if (!LIVRE::where('id', $id)->exists()) {
            return response()->json(['message' => 'Livre not found'], 404);
        }
        $livre = LIVRE::find($id);
        $livre->update($request->all());
        return response()->json($livre, 200);
    }
    /**
     * @group Livres
     * Delete a specific livre.
     */
    
    public function destroy($id)
    {
        if (!LIVRE::where('id', $id)->exists()) {
            return response()->json(['message' => 'Livre not found'], 404);
        }
        $livre = LIVRE::find($id);
        $livre->delete();
        return response()->json(['message' => 'Livre deleted successfully'], 200);
    
    }

    public function getLivresCount()
    {
        $count = LIVRE::count();
        return response()->json(['count' => $count], 200);
    }
    public function getGenresList()
    {
        $genres = LIVRE::distinct()->pluck('genre');
        return response()->json(['genres' => $genres], 200);
    }
    public function getAuthorsList()
    {
        $authors = LIVRE::distinct()->pluck('auteur');
        return response()->json(['authors' => $authors], 200);
    }
    public function getEditionsList()
    {
        $editions = LIVRE::distinct()->pluck('annee');
        return response()->json(['editions' => $editions], 200);
    }

}
