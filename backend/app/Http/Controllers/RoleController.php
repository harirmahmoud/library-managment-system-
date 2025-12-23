<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class RoleController extends Controller
{
    /**
     * @group Roles
     * Get a list of roles and permissions.
     */
    public function index()
    {
       return response()->json(['roles' => Role::all(),'permissions' => Permission::all()], 200);
    }
    /**
     * @group Roles
     * Get a specific role.
     */
    public function show($id)
    {
        $role = Role::find($id);
        if (!$role) {
            return response()->json(['message' => 'Role not found'], 404);
        }
        return response()->json(['role' => $role], 200);
    }

    /**
     * @group Roles
     * Assign roles to users.
     * @bodyParam user_id int required The ID of the user.
     * @bodyParam role_id int required The ID of the role.
     */
    public function assignRoles(Request $request)
    {
        // Logic to assign roles to users
        $validatedData = $request->validate([
            'user_id' => 'required|exists:users,id',
            'role_id' => 'exists:roles,id',
        ]);
   
        try {
        $role_permissions = [];
        $role = Role::find($validatedData['role_id']);
        if ($role) {
            $permissions = $role->permissions;
            foreach ($permissions as $permission) {
                $role_permissions[] = $permission->name;
            }
        }

            foreach ($role_permissions as $permission_name) {
                if (empty($permission_name)) {
                    continue;
                }
                switch ($permission_name) {
                    case 'gerer users':
                        $permission_name = 'users';
                        break;
                    case 'gerer etudiants':
                        $permission_name = 'etudiants';
                        break;
                    case 'gerer personnels':
                        $permission_name = 'personnels';
                        break;
                    case 'gerer livres':
                        $permission_name = 'livres';
                        break;
                    case 'gerer emprunts':
                        $permission_name = 'emprunts';
                        break;
                    case 'gerer details emprunts':
                        $permission_name = 'emprunts';
                        break;
                    case 'gerer retards':
                        $permission_name = 'retards';
                        break;
                    default:
                        // Handle unknown permission
                        continue 2; // Skip to the next permission
                }
                DB::connection('oracle_sysdba')->statement("GRANT SELECT ON amine." . $permission_name . " TO " . User::find($validatedData['user_id'])->name);
                DB::connection('oracle_sysdba')->statement("GRANT INSERT ON amine." . $permission_name . " TO "  . User::find($validatedData['user_id'])->name);
                DB::connection('oracle_sysdba')->statement("GRANT UPDATE ON amine." . $permission_name . " TO "  . User::find($validatedData['user_id'])->name);
                DB::connection('oracle_sysdba')->statement("GRANT DELETE ON amine." . $permission_name . " TO "  . User::find($validatedData['user_id'])->name);
            }
      
        $user = User::find($validatedData['user_id']);
        if (!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }

        $user->roles()->attach($validatedData['role_id']);

        return response()->json(['message' => 'Roles assigned successfully'], 200);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to assign roles: ' . $e->getMessage()], 500);
        }
    }
    /**
     * @group Roles
     * Revoke roles from users.
     * @bodyParam user_id int required The ID of the user.
     * @bodyParam role_id int required The ID of the role.
     */
    public function revokeRoles(Request $request)
    {
        // Logic to revoke roles from users
        $validatedData = $request->validate([
            'user_id' => 'required|exists:users,id',
            'role_id' => 'exists:roles,id',
        ]);
        try {
        $role_permissions = [];
        $role = Role::find($validatedData['role_id']);
        if ($role) {
            $permissions = $role->permissions;
            foreach ($permissions as $permission) {
                $role_permissions[] = $permission->name;
            }
        }
            foreach ($role_permissions as $permission_name) {
                if (empty($permission_name)) {
                    continue;
                }
                switch ($permission_name) {
                    case 'gerer users':
                        $permission_name = 'users';
                        break;
                    case 'gerer etudiants':
                        $permission_name = 'etudiants';
                        break;
                    case 'gerer personnels':
                        $permission_name = 'personnels';
                        break;
                    case 'gerer livres':
                        $permission_name = 'livres';
                        break;
                    case 'gerer emprunts':
                        $permission_name = 'emprunts';
                        break;
                    case 'gerer details emprunts':
                        $permission_name = 'emprunts';
                        break;
                    case 'gerer retards':
                        $permission_name = 'retards';
                        break;
                    default:
                        // Handle unknown permission
                        continue 2; // Skip to the next permission
                }
            
                DB::connection('oracle_sysdba')->statement("REVOKE SELECT ON amine." . $permission_name . " FROM "   . User::find($validatedData['user_id'])->name);
                DB::connection('oracle_sysdba')->statement("REVOKE INSERT ON amine." . $permission_name . " FROM "  . User::find($validatedData['user_id'])->name);
                DB::connection('oracle_sysdba')->statement("REVOKE UPDATE ON amine." . $permission_name . " FROM "  . User::find($validatedData['user_id'])->name);
                DB::connection('oracle_sysdba')->statement("REVOKE DELETE ON amine." . $permission_name . " FROM "  . User::find($validatedData['user_id'])->name);
            }
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to revoke roles: ' . $e->getMessage()], 500);
        }
        $user = User::find($validatedData['user_id']);
        if (!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }

        $user->roles()->detach($validatedData['role_id']);

        return response()->json(['message' => 'Roles revoked successfully'], 200);
    }
    /**
     * @group Roles
     * Assign permissions to roles.
     * @bodyParam role_id int required The ID of the role.
     * @bodyParam permissions_id  required The IDs of the permissions.
     */
    public function assignPermissions(Request $request)
    {
        // Logic to assign permissions to users
        $validatedData = $request->validate([
            'role_id' => 'required|exists:roles,id',
            'permissions_id' => 'exists:permissions,id',
        ]);

        $role = Role::find($validatedData['role']);
        if (!$role) {
            return response()->json(['message' => 'Role not found'], 404);
        }


        $role->permissions()->sync($validatedData['permissions']);

        return response()->json(['message' => 'Permissions assigned successfully'], 200);
    }
    /**
     * @group Roles
     * Revoke permissions from roles.
     * @bodyParam role_id int required The ID of the role.
     * @bodyParam permissions_id  required The IDs of the permissions.
     */
    public function revokePermissions(Request $request)
    {
        // Logic to revoke permissions from users
        $validatedData = $request->validate([
            'role' => 'required|exists:roles,id',
            'permissions' => 'exists:permissions,id',
        ]);

        $role = Role::find($validatedData['role']);
        if (!$role) {
            return response()->json(['message' => 'Role not found'], 404);
        }

        $role->permissions()->detach($validatedData['permissions']);

        return response()->json(['message' => 'Permissions revoked successfully'], 200);
    }
    /**
     * @group Roles
     * Get all roles.
     */
    public function getALLRoles()
    {
        $roles = Role::all();
        return response()->json(['roles' => $roles], 200);
    }
    /**
     * @group Roles
     * Get all permissions.
     */
    public function getALLPermissions()
    {
        $permissions = Permission::all();
        return response()->json(['permissions' => $permissions], 200);
    }   
}
