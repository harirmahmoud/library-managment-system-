<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ETUDIANT extends Model
{
   protected $fillable = [
        'nom',
        'prenom',
        'filiere',
        'niveau',
    ];
    public $timestamps = false;
    protected $table = 'etudiants';
    public function emprunts():HasMany
    {
        return $this->hasMany(EMPRUNT::class);
    }
}
