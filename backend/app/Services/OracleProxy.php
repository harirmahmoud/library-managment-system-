<?php

namespace App\Services;

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;

class OracleProxy
{
    public static function connection()
    {
        $user = Auth::user()?->name;

        // If no user logged in, return normal DB
        if (!$user) {
            return DB::connection('oracle');
        }

        // Get original Oracle config
        $config = config('database.connections.oracle');

        // Build proxy username
        $config['username'] = $config['username'] . '[' . strtoupper($user) . ']';

        // Register dynamic connection
        config(['database.connections.oracle_proxy' => $config]);

        // Use the dynamically-registered connection
        return DB::connection('oracle_proxy');
    }
}
