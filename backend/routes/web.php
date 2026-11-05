<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    $indexPath = public_path('index.html');
    if (file_exists($indexPath)) {
        return response(file_get_contents($indexPath))
            ->header('Content-Type', 'text/html; charset=UTF-8');
    }
    return view('welcome');
});

Route::fallback(function () {
    $indexPath = public_path('index.html');
    if (file_exists($indexPath)) {
        return response(file_get_contents($indexPath))
            ->header('Content-Type', 'text/html; charset=UTF-8');
    }
    return response()->json(['message' => 'Ruta no encontrada'], 404);
});
