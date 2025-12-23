<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class PERSONNEL extends Model
{
    //
    protected $fillable = [
        'nom',
        'prenom',
        'fonction',
    ];
    protected $table = 'personnels';
    public $timestamps = false;
    public function emprunts():HasMany
    {
        return $this->hasMany(EMPRUNT::class);
    }   
    
}
