<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\City;
use Illuminate\Http\JsonResponse;

class PublicCityController extends Controller
{
    /**
     * Listado público de ciudades y departamentos con conteo de negocios.
     */
    public function index(): JsonResponse
    {
        $cities = City::withCount([
            'businesses' => function ($q) {
                $q->where('status', 'approved');
            }
        ])
        ->orderBy('department')
        ->orderBy('name')
        ->get();

        return response()->json($cities);
    }
}

