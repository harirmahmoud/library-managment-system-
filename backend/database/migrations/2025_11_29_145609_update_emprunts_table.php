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
        //
        Schema::table('emprunts', function (Blueprint $table) {
            $table->dropColumn('date_emprunt');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        //
        Schema::table('emprunts', function (Blueprint $table) {
            $table->date('date_emprunt');
        });
    }
};
