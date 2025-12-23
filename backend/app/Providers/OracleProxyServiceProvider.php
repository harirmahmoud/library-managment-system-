<?php

namespace App\Providers;

use App\Services\OracleProxy;
use Illuminate\Database\ConnectionResolverInterface;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\ServiceProvider;
    

class ProxyConnectionResolver implements ConnectionResolverInterface
{
    public function connection($name = null)
    {
        return OracleProxy::connection();
    }

    public function getDefaultConnection()
    {
        return 'oracle';
    }

    public function setDefaultConnection($name)
    {
        // Not needed
    }
}
class OracleProxyServiceProvider extends ServiceProvider
{
    /**
     * Register services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
        Model::setConnectionResolver(new ProxyConnectionResolver());
    }
}
