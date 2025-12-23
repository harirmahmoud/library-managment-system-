<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Laravel\Sanctum\PersonalAccessToken;

class authController extends Controller
{
    /**
 * @group Authentication
 * create a user .
 *
 * @bodyParam name string required The user's name.
 * @bodyParam email string required The user's email.
 * @bodyParam password string required The user's password.
 */
    //
    public function createUser(Request $request)
    {
        $validatedData = $request->validate([
            'name' => 'required|string|max:255|unique:users,name',
            'email' => 'required|string|email|max:255|unique:users,email',
            'password' => 'required|string|min:6',
        ]);
        $credentials = $request->only('name', 'email', 'password');
        try {

            try {
                DB::connection('oracle_sysdba')->statement("ALTER SESSION SET \"_ORACLE_SCRIPT\"=true");
                DB::connection('oracle_sysdba')->statement("CREATE USER " . $credentials['name'] . " IDENTIFIED BY " . $credentials['password'] . " ");
                DB::connection('oracle_sysdba')->statement("GRANT CONNECT, RESOURCE TO " . $credentials['name']);
                DB::connection('oracle_sysdba')->statement("GRANT shared_schema TO " . $credentials['name']);
                DB::connection('oracle_sysdba')->statement("ALTER USER " . $credentials['name'] . " QUOTA UNLIMITED ON users");
                DB::connection('oracle_sysdba')->statement("ALTER USER " . $credentials['name'] . " GRANT CONNECT THROUGH amine");
            } catch (\Exception $e) {
                return response()->json([
                    'error' => $e->getMessage()
                ], 500);
            }
            $user = User::create([
                'name' => $credentials['name'],
                'email' => $credentials['email'],
                'password' => Hash::make($credentials['password']),
            ]);
        } catch (\Exception $e) {
            return response()->json(['error' => 'User creation failed: ' . $e->getMessage()], 500);
        }

        return response()->json($user, 201);
    }

  /**
 * @group Authentication
 * Login a user and get tokens.
 *
 * @bodyParam name string required The user's name.
 * @bodyParam password string required The user's password.
 */

    public function login(Request $request)
    {
        $request->validate([
            'name' => 'required|string',
            'password' => 'required|string',
        ]);
        $credentials = $request->only('name', 'password');
        if (!auth()->attempt($credentials)) {
            return response()->json(['message' => 'Invalid credentials'], 401);
        }

        try {

            // Try to connect as the given user
            $conn = oci_connect(
                $credentials['name'],
                $credentials['password'],
                env('DB_HOST', 'localhost') . ':' . env('DB_PORT', '1521') . '/' . env('DB_DATABASE', 'XEPDB1'),
                'AL32UTF8'
            );

            if (!$conn) {
                $e = oci_error();
                return response()->json([
                    'error' => 'Invalid Oracle username or password',
                    'details' => $e['message']
                ], 401);
            }

            $accessTokenExpiresAt = now()->addDays(1);
            $refreshTokenExpiresAt = now()->addDays(7);
            $access_token = auth()->user()->createToken('access_token', ['*'], $accessTokenExpiresAt)->plainTextToken;
            $refresh_token = auth()->user()->createToken('refresh_token', ['refresh'], $refreshTokenExpiresAt)->plainTextToken;

            return response()->json([
                'user' => auth()->user(),
                'token' => $access_token,
                'refresh_token' => $refresh_token,
                'token_type' => 'Bearer',
                'expires_at' => $accessTokenExpiresAt->toDateTimeString(),
                'refresh_token_expires_at' => $refreshTokenExpiresAt->toDateTimeString(),

            ], 200);
            oci_close($conn);
        } catch (\Exception $e) {
            return response()->json([
                'error' => $e->getMessage()
            ], 500);
        }
    }
    /**
 * @group Authentication
 * Logout the authenticated user.
 * @bodyParam Authorization string required The Bearer token.
 */
    public function logout(Request $request)
    {
        $currentAccessToken = $request->bearerToken();
        if ($currentAccessToken) {
            $token = PersonalAccessToken::findToken($currentAccessToken);
            if ($token) {
                $token->delete();
            }
        }
        try {
            $request->session()->invalidate();
            $request->session()->regenerateToken();
            auth()->logout();
        } catch (\Exception $e) {
            return response()->json(['error' => 'Logout failed: ' . $e->getMessage()], 500);
        }

        return response()->json(['message' => 'Logged out successfully'], 200);
    }
    /**
 * @group Authentication
 * Refresh the access token using the refresh token.
 * @bodyParam Authorization string required The Bearer refresh token.
 */

    public function refreshToken(Request $request)
    {
        $currentRefreshToken = $request->bearerToken();
        $user = auth()->user();
        $refreshToken = PersonalAccessToken::findToken($currentRefreshToken);
        if (!$user) {
            return response()->json(['message' => 'Unauthenticated'], 401);
        }

        // Validate the refresh token
        if (!$currentRefreshToken) {
            return response()->json(['message' => 'Invalid refresh token'], 401);
        }
        $user = $refreshToken->tokenable;
        $refreshToken->delete();
        // Revoke all existing tokens
        $user->tokens()->delete();

        // Create new tokens
        $accessTokenExpiresAt = now()->addDays(1);
        $refreshTokenExpiresAt = now()->addDays(7);
        $access_token = $user->createToken('access_token', ['*'], $accessTokenExpiresAt)->plainTextToken;
        $refresh_token = $user->createToken('refresh_token', ['refresh'], $refreshTokenExpiresAt)->plainTextToken;

        return response()->json([
            'user' => $user,
            'token' => $access_token,
            'refresh_token' => $refresh_token,
            'token_type' => 'Bearer',
            'expires_at' => $accessTokenExpiresAt->toDateTimeString(),
            'refresh_token_expires_at' => $refreshTokenExpiresAt->toDateTimeString(),
        ], 200);
    }
    /**
 * @group Authentication
 * Get the authenticated user's profile.
 * @bodyParam Authorization string required The Bearer token.   
 * //
 */
    public function profile()
    {
        return response()->json([
            'user' => auth()->user(),
            'roles' => auth()->user()->roles,
            'permissions' => auth()->user()->getAllPermissions(),
        ]);
    }
}
