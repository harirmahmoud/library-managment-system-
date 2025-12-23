<?php

namespace App\Http\Controllers;

use App\Models\DETAIL_EMPRUNT;
use App\Models\EMPRUNT;
use Illuminate\Http\Request;
use App\Models\LIVRE;
use Illuminate\Support\Facades\DB;

class AnalyticsController extends Controller
{
    //
    public function getLivresCount()
    {
        $count = LIVRE::count();
        return response()->json(['count' => $count], 200);
    }
    public function getEmpruntsCount()
    {
        $count = EMPRUNT::count();
        return response()->json(['count' => $count], 200);
    }
    public function getFrequentLivres()
    {
        $topLivres_IDS = DETAIL_EMPRUNT::select('livre_id', DB::raw('count(*) as total'))
            ->groupBy('livre_id')
            ->orderBy('total', 'desc')
            ->with('livre')
            ->take(10)
            ->get();
        $topLivres = [];
        foreach ($topLivres_IDS as $item) {
            $livre = LIVRE::find($item->livre_id);
            if ($livre) {
                $topLivres[] = [
                    'livre' => $livre,
                    'emprunt_count' => $item->total,
                ];
            }
        }

        return response()->json(['top_livres' => $topLivres], 200);
    }
    public function getFrequentEmprunteurs()
    {
        $topEtudiants = EMPRUNT::select('etudiant_id', DB::raw('count(*) as total'))
            ->groupBy('etudiant_id')
            ->orderBy('total', 'desc')
            ->take(10)
            ->get();

        return response()->json(['top_etudiants' => $topEtudiants], 200);
    }
    public function getRetardsCount()
    {
        $count = DB::table('retards')->count();
        return response()->json(['count' => $count], 200);
    }
    public function getRetardsEmprunteurs()
    {
        $topEtudiants = DB::table('emprunts')
            ->join('retards', 'emprunts.id', '=', 'retards.emprunt_id')
            ->join('etudiants', 'emprunts.etudiant_id', '=', 'etudiants.id')
            ->select('etudiants.id', 'etudiants.nom', DB::raw('count(*) as total'))
            ->groupBy('etudiants.id', 'etudiants.nom')
            ->orderBy('total', 'desc')
            ->take(10)
            ->get();

        return response()->json(['top_etudiants_with_retards' => $topEtudiants], 200);
    }
    
}
