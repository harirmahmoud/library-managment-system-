<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
use App\Models\User;
class RoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
       $admin = Role::create(['name' => 'admin']);
       $gestionnaire_livres = Role::create(['name' => 'gestionnaire_livres']);
       $gestionnaire_etudiant = Role::create(['name' => 'gestionnaire_etudiant']);
       $responsable = Role::create(['name' => 'responsable']);
       $gerer_livres = Permission::create(['name' => 'gerer livres']);
       $gerer_details_emprunts = Permission::create(['name' => 'gerer les details emprunts']);
       $gerer_etudiants = Permission::create(['name' => 'gerer etudiants']);
       $gerer_emprunts = Permission::create(['name' => 'gerer les emprunts']);
       $gerer_retards = Permission::create(['name' => 'gerer les retards']);
       $gerer_personnels = Permission::create(['name' => 'gerer personnels']);
       $gerer_users = Permission::create(['name' => 'gerer users']);
       $admin->givePermissionTo(Permission::all());
       $gestionnaire_livres->givePermissionTo([$gerer_livres, $gerer_details_emprunts]);
       $gestionnaire_etudiant->givePermissionTo([$gerer_etudiants,$gerer_emprunts]);
       $responsable->givePermissionTo([$gerer_retards]);
       $user = User::find(2);
       $user->assignRole($admin);
    }
}
