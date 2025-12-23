<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class RETARD extends Model
{
    //
    protected $fillable = [
        'emprunt_id',
        'date_ret',
        'montant',
    ];
    protected $table = 'retards';
    public function emprunt():BelongsTo
    {
        return $this->belongsTo(EMPRUNT::class);
    }
}
