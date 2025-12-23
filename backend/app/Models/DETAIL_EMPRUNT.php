<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DETAIL_EMPRUNT extends Model
{
    //
    protected $fillable = [
        'emprunt_id',
        'livre_id',
        'qte_emp',
    ];

    public $timestamps = false;
    protected $table = 'detail_emprunts';
    public function emprunt()
    {
        return $this->belongsTo(EMPRUNT::class);
    }
}
