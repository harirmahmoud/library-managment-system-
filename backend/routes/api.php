<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\EtudiantController;
use App\Http\Controllers\PersonnelController;
use App\Http\Controllers\LIVREController;
use App\Http\Controllers\EmpruntController;
use App\Http\Controllers\RetardController;


Route::prefix('v1')->group(function () {
    Route::post('/login', [App\Http\Controllers\authController::class, 'login'])->name('auth.login');
    Route::post('/register', [App\Http\Controllers\authController::class, 'createUser'])->name('auth.register');
Route::middleware('auth:sanctum')->group(function () {
    Route::prefix('auth')->group(function () {
        Route::get('/profile', [App\Http\Controllers\authController::class, 'profile'])->name('auth.profile');
        Route::post('/logout', [App\Http\Controllers\authController::class, 'logout'])->name('auth.logout');
        Route::post('/refresh', [App\Http\Controllers\authController::class, 'refreshToken'])->name('auth.refresh');
    });
    Route::middleware('can:gerer users')->group(function () {
        Route::apiResource('user', App\Http\Controllers\UserController::class);
        Route::prefix('roles')->group(function () {
            Route::apiResource('/', App\Http\Controllers\RoleController::class)->except(['create', 'edit'])->name('','roles');
            Route::post('assign-roles', [App\Http\Controllers\RoleController::class, 'assignRoles'])->name('roles.assign');
            Route::delete('revoke-roles', [App\Http\Controllers\RoleController::class, 'revokeRoles'])->name('roles.revoke');
            Route::post('assign-permissions', [App\Http\Controllers\RoleController::class, 'assignPermissions'])->name('roles.permissions.assign');
            Route::delete('revoke-permissions', [App\Http\Controllers\RoleController::class, 'revokePermissions'])->name('roles.permissions.revoke');
            Route::get('roles', [App\Http\Controllers\RoleController::class, 'getAllRoles'])->name('roles.all');
            Route::get('permissions', [App\Http\Controllers\RoleController::class, 'getAllPermissions'])->name('roles.permissions.all');
        });

    });
    Route::middleware('can:gerer etudiants')->group(function () {
        Route::apiResource('etudiant', App\Http\Controllers\EtudiantController::class)->name('','etudiant');
        
    
    });
    Route::middleware('can:gerer personnels')->group(function () {
        Route::apiResource('personnel', App\Http\Controllers\PersonnelController::class)->name('','personnel');
    });
    Route::middleware('can:gerer livres')->group(function () {
        Route::apiResource('livre', App\Http\Controllers\LIVREController::class)->name('','livres');
        Route::prefix('livres')->group(function () {
        Route::get('genres', [App\Http\Controllers\LIVREController::class, 'getGenresList'])->name('livre.genres.list');
        Route::get('authors', [App\Http\Controllers\LIVREController::class, 'getAuthorsList'])->name('livre.authors.list');
        Route::get('editions', [App\Http\Controllers\LIVREController::class, 'getEditionsList'])->name('livre.editions.list');
  });
    });
    Route::middleware('can:gerer les emprunts, gerer  les details emprunts')->group(function () {
        Route::apiResource('emprunt', App\Http\Controllers\EmpruntController::class);
    });
    Route::middleware('can:gerer les retards')->group(function () {
        Route::apiResource('retard', App\Http\Controllers\RetardController::class);
    });
    Route::middleware('can:gerer users')->group(function () {
        Route::prefix('analytics')->group(function () {
            Route::get('/livres/count', [App\Http\Controllers\AnalyticsController::class, 'getLivresCount'])->name('analytics.livres');
            Route::get('/emprunts/count', [App\Http\Controllers\AnalyticsController::class, 'getEmpruntsCount'])->name('analytics.emprunts');
            Route::get('/retards/count', [App\Http\Controllers\AnalyticsController::class, 'getRetardsCount'])->name('analytics.retards');
            Route::get('/livres/top', [App\Http\Controllers\AnalyticsController::class, 'getFrequentLivres'])->name('analytics.livres.top');
            Route::get('/emprunts/top', [App\Http\Controllers\AnalyticsController::class, 'getFrequentEmprunteurs'])->name('analytics.emprunts.top');
            Route::get('/retards/top', [App\Http\Controllers\AnalyticsController::class, 'getRetardsEmprunteurs'])->name('analytics.retards.top');

        });
    });
    });
});

