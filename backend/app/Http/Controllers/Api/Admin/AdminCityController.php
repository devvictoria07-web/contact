<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\City;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

class AdminCityController extends Controller
{
    /**
     * Listado completo de ciudades para el panel admin.
     */
    public function index(): JsonResponse
    {
        $cities = City::withCount('businesses')
            ->orderBy('department')
            ->orderBy('name')
            ->get();

        return response()->json($cities);
    }

    /**
     * Crear una nueva ciudad/departamento.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'department' => ['required', 'string', 'max:255'],
        ], [
            'name.required' => 'El nombre de la ciudad o municipio es obligatorio.',
            'department.required' => 'El departamento es obligatorio.',
        ]);

        $slug = Str::slug($validated['name'] . '-' . $validated['department']);
        if (City::where('slug', $slug)->exists()) {
            return response()->json([
                'message' => 'Esta ciudad/departamento ya se encuentra registrada.',
            ], 422);
        }

        $city = City::create([
            'name' => $validated['name'],
            'department' => $validated['department'],
            'slug' => $slug,
        ]);

        return response()->json([
            'message' => 'Ciudad creada exitosamente.',
            'city' => $city->loadCount('businesses'),
        ], 201);
    }

    /**
     * Actualizar ciudad.
     */
    public function update(Request $request, int $id): JsonResponse
    {
        $city = City::findOrFail($id);

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'department' => ['required', 'string', 'max:255'],
        ]);

        $slug = Str::slug($validated['name'] . '-' . $validated['department']);

        $city->update([
            'name' => $validated['name'],
            'department' => $validated['department'],
            'slug' => $slug,
        ]);

        return response()->json([
            'message' => 'Ciudad actualizada correctamente.',
            'city' => $city->fresh()->loadCount('businesses'),
        ]);
    }

    /**
     * Eliminar ciudad.
     */
    public function destroy(int $id): JsonResponse
    {
        $city = City::findOrFail($id);

        if ($city->businesses()->count() > 0) {
            return response()->json([
                'message' => 'No se puede eliminar esta ciudad porque tiene negocios asociados. Primero reasigne o elimine los negocios correspondientes.',
            ], 422);
        }

        $city->delete();

        return response()->json([
            'message' => 'Ciudad eliminada exitosamente.',
        ]);
    }
}

