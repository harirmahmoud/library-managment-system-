<?php

namespace App\Http\Controllers;

use App\Models\PERSONNEL;
use Illuminate\Http\Request;

class PersonnelController extends Controller
{
    public function index()
    {
        return response()->json(PERSONNEL::all(), 200);
    }
    public function show($id)
    {
        if(!PERSONNEL::where('id', $id)->exists()){
            return response()->json(['message' => 'Personnel not found'], 404);
        }
        return response()->json(PERSONNEL::find($id), 200);
    }
    public function store(Request $request)
    {
        try {
            $request->validate([
                'name' => 'required|string|max:255',
                'prenom' => 'required|string|max:255',
                'poste' => 'required|string|max:255',
            ]);
            $personnel = PERSONNEL::create($request->all());
            return response()->json($personnel, 201);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Failed to create personnel'], 500);
        }
    
    
    }
    public function update(Request $request, $id)
    {
        if(!PERSONNEL::where('id', $id)->exists()){
            return response()->json(['message' => 'Personnel not found'], 404);
        }
        $personnel = PERSONNEL::find($id);
        $personnel->update($request->all());
        return response()->json($personnel, 200);
    }
    public function destroy($id)
    {
        if(!PERSONNEL::where('id', $id)->exists()){
            return response()->json(['message' => 'Personnel not found'], 404);
        }
        $personnel = PERSONNEL::find($id);
        $personnel->delete();
        return response()->json(['message' => 'Personnel deleted successfully'], 200);
    }

}
