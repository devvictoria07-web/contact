<?php

use App\Http\Controllers\Api\Admin\AdminBusinessController;
use App\Http\Controllers\Api\Admin\AdminCategoryController;
use App\Http\Controllers\Api\Admin\AdminCityController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\OwnerBusinessController;
use App\Http\Controllers\Api\PublicBusinessController;
use App\Http\Controllers\Api\PublicCategoryController;
use App\Http\Controllers\Api\PublicCityController;
use App\Http\Controllers\Api\StatsController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Rutas Públicas (Catálogo Comercial y Autenticación)
|--------------------------------------------------------------------------
*/
Route::get('/businesses', [PublicBusinessController::class, 'index']);
Route::get('/businesses/featured', [PublicBusinessController::class, 'featured']);
Route::get('/businesses/{slugOrId}', [PublicBusinessController::class, 'show']);

Route::get('/categories', [PublicCategoryController::class, 'index']);
Route::get('/categories/{slugOrId}', [PublicCategoryController::class, 'show']);

Route::get('/cities', [PublicCityController::class, 'index']);
Route::get('/stats', [StatsController::class, 'publicStats']);
Route::get('/debug-db', function () {
    try {
        $count = \Illuminate\Support\Facades\DB::table('businesses')->count();
        return response()->json([
            'status' => 'connected',
            'business_count' => $count,
            'default_driver' => config('database.default'),
            'host' => config('database.connections.mysql.host'),
            'database' => config('database.connections.mysql.database'),
            'username' => config('database.connections.mysql.username'),
            'ssl_ca' => config('database.connections.mysql.options.' . PDO::MYSQL_ATTR_SSL_CA),
        ]);
    } catch (\Throwable $e) {
        return response()->json([
            'status' => 'error',
            'message' => $e->getMessage(),
            'code' => $e->getCode(),
            'default_driver' => config('database.default'),
            'host' => config('database.connections.mysql.host'),
            'ssl_ca' => config('database.connections.mysql.options.' . PDO::MYSQL_ATTR_SSL_CA),
            'trace' => explode("\n", $e->getTraceAsString()),
        ], 200);
    }
});

Route::prefix('auth')->group(function () {
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);
});

/*
|--------------------------------------------------------------------------
| Rutas Autenticadas (Propietarios y Usuarios)
|--------------------------------------------------------------------------
*/
Route::middleware('auth:sanctum')->group(function () {
    Route::prefix('auth')->group(function () {
        Route::post('/logout', [AuthController::class, 'logout']);
        Route::get('/me', [AuthController::class, 'me']);
    });

    // Panel de propietario para gestión de sus negocios
    Route::prefix('owner')->group(function () {
        Route::get('/businesses', [OwnerBusinessController::class, 'index']);
        Route::post('/businesses', [OwnerBusinessController::class, 'store']);
        Route::get('/businesses/{id}', [OwnerBusinessController::class, 'show']);
        Route::post('/businesses/{id}', [OwnerBusinessController::class, 'update']);
        Route::put('/businesses/{id}', [OwnerBusinessController::class, 'update']);
        Route::delete('/businesses/{id}', [OwnerBusinessController::class, 'destroy']);
    });

    /*
    |--------------------------------------------------------------------------
    | Rutas de Administración (Solo usuarios con rol 'admin')
    |--------------------------------------------------------------------------
    */
    Route::middleware('admin')->prefix('admin')->group(function () {
        Route::get('/stats', [StatsController::class, 'adminStats']);

        // Gestión y Aprobación de Negocios
        Route::get('/businesses', [AdminBusinessController::class, 'index']);
        Route::get('/businesses/{id}', [AdminBusinessController::class, 'show']);
        Route::put('/businesses/{id}/status', [AdminBusinessController::class, 'updateStatus']);
        Route::put('/businesses/{id}/toggle-featured', [AdminBusinessController::class, 'toggleFeatured']);
        Route::post('/businesses/{id}', [AdminBusinessController::class, 'update']);
        Route::put('/businesses/{id}', [AdminBusinessController::class, 'update']);
        Route::delete('/businesses/{id}', [AdminBusinessController::class, 'destroy']);
        Route::post('/import-paginas-amarillas', [AdminBusinessController::class, 'importPaginasAmarillas']);

        // CRUD de Categorías
        Route::get('/categories', [AdminCategoryController::class, 'index']);
        Route::post('/categories', [AdminCategoryController::class, 'store']);
        Route::put('/categories/{id}', [AdminCategoryController::class, 'update']);
        Route::delete('/categories/{id}', [AdminCategoryController::class, 'destroy']);

        // CRUD de Ciudades y Departamentos
        Route::get('/cities', [AdminCityController::class, 'index']);
        Route::post('/cities', [AdminCityController::class, 'store']);
        Route::put('/cities/{id}', [AdminCityController::class, 'update']);
        Route::delete('/cities/{id}', [AdminCityController::class, 'destroy']);
    });
});
