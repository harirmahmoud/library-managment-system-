<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class LIVRE extends Model
{
    //
    protected $fillable = [
        'titre',
        'auteur',
        'annee',
        'genre',
        'isbn',
        'quantite',
    ];
    public $timestamps = false;
    protected $table = 'livres';
}
