<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class EMPRUNT extends Model
{
    //
   protected $fillable = [
        'etudiant_id',
        'livre_id',
        'date_emprunt',
        'user_id',
    ];
    protected $table = 'emprunts';
    public function etudiant():BelongsTo
    {
        return $this->belongsTo(ETUDIANT::class);
    }
    public function livre():BelongsTo
    {
        return $this->belongsTo(LIVRE::class);
    }
    public function details():HasMany
    {
        return $this->hasMany(DETAIL_EMPRUNT::class,'emprunt_id');
    }



}
