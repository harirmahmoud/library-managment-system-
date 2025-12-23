<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
          Schema::dropIfExists('detail_emprunts');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::create('detail_emprunts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('emprunt_id')->constrained()->onDelete('cascade');
            $table->foreignId('livre_id')->constrained()->onDelete('cascade');
            $table->integer('qte_emp');
        });
    }
};
