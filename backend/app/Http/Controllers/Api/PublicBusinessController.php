<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Business;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PublicBusinessController extends Controller
{
    /**
     * Listado público de negocios aprobados con filtros combinados y paginación.
     */
    public function index(Request $request): JsonResponse
    {
        $query = Business::with(['city', 'categories'])
            ->where('status', 'approved');

        // Filtro por término de búsqueda (nombre, descripción, dirección, teléfono)
        if ($request->filled('search')) {
            $search = trim($request->input('search'));
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('short_description', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%")
                  ->orWhere('address', 'like', "%{$search}%")
                  ->orWhere('phone', 'like', "%{$search}%")
                  ->orWhereHas('categories', function ($catQ) use ($search) {
                      $catQ->where('name', 'like', "%{$search}%");
                  })
                  ->orWhereHas('city', function ($cityQ) use ($search) {
                      $cityQ->where('name', 'like', "%{$search}%")
                            ->orWhere('department', 'like', "%{$search}%");
                  });
            });
        }

        // Filtro por categoría (acepta ID o slug)
        if ($request->filled('category')) {
            $category = $request->input('category');
            $query->whereHas('categories', function ($q) use ($category) {
                if (is_numeric($category)) {
                    $q->where('categories.id', $category);
                } else {
                    $q->where('categories.slug', $category);
                }
            });
        }

        // Filtro por ciudad (acepta ID o slug)
        if ($request->filled('city')) {
            $city = $request->input('city');
            $query->whereHas('city', function ($q) use ($city) {
                if (is_numeric($city)) {
                    $q->where('cities.id', $city);
                } else {
                    $q->where('cities.slug', $city);
                }
            });
        }

        // Filtro por departamento
        if ($request->filled('department')) {
            $dept = $request->input('department');
            $query->whereHas('city', function ($q) use ($dept) {
                $q->where('cities.department', $dept);
            });
        }

        // Filtro destacados
        if ($request->boolean('featured')) {
            $query->where('featured', true);
        }

        // Orden: los destacados primero, luego los más recientes
        $query->orderByDesc('featured')->orderByDesc('created_at');

        $perPage = min((int) $request->input('per_page', 12), 50);
        $businesses = $query->paginate($perPage);

        return response()->json($businesses);
    }

    /**
     * Negocios destacados para portada.
     */
    public function featured(): JsonResponse
    {
        $businesses = Business::with(['city', 'categories'])
            ->where('status', 'approved')
            ->where('featured', true)
            ->inRandomOrder()
            ->take(6)
            ->get();

        return response()->json($businesses);
    }

    /**
     * Vista de detalle de un negocio (por slug o ID).
     */
    public function show(Request $request, string $slugOrId): JsonResponse
    {
        $business = Business::with(['city', 'categories', 'user:id,name,email'])
            ->where(function ($q) use ($slugOrId) {
                if (is_numeric($slugOrId)) {
                    $q->where('id', $slugOrId)->orWhere('slug', $slugOrId);
                } else {
                    $q->where('slug', $slugOrId);
                }
            })
            ->firstOrFail();

        // Si no está aprobado, solo el dueño o un admin pueden verlo
        if ($business->status !== 'approved') {
            $user = $request->user('sanctum');
            if (!$user || (!$user->isAdmin() && $user->id !== $business->user_id)) {
                return response()->json([
                    'message' => 'Este negocio se encuentra en revisión o no está disponible públicamente.',
                ], 404);
            }
        }

        // Negocios relacionados en la misma categoría o ciudad
        $categoryIds = $business->categories->pluck('id')->toArray();
        $related = Business::with(['city', 'categories'])
            ->where('status', 'approved')
            ->where('id', '!=', $business->id)
            ->where(function ($q) use ($categoryIds, $business) {
                $q->whereHas('categories', fn($catQ) => $catQ->whereIn('categories.id', $categoryIds))
                  ->orWhere('city_id', $business->city_id);
            })
            ->take(3)
            ->get();

        return response()->json([
            'business' => $business,
            'related' => $related,
        ]);
    }
}

