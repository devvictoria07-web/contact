<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Http\JsonResponse;

class PublicCategoryController extends Controller
{
    /**
     * Listado público de categorías con conteo de negocios aprobados.
     */
    public function index(): JsonResponse
    {
        $categories = Category::withCount([
            'businesses' => function ($q) {
                $q->where('status', 'approved');
            }
        ])
        ->orderBy('name')
        ->get();

        return response()->json($categories);
    }

    /**
     * Detalle de categoría con sus negocios aprobados.
     */
    public function show(string $slugOrId): JsonResponse
    {
        $category = Category::where(function ($q) use ($slugOrId) {
            if (is_numeric($slugOrId)) {
                $q->where('id', $slugOrId)->orWhere('slug', $slugOrId);
            } else {
                $q->where('slug', $slugOrId);
            }
        })
        ->withCount([
            'businesses' => function ($q) {
                $q->where('status', 'approved');
            }
        ])
        ->firstOrFail();

        $businesses = $category->businesses()
            ->with(['city', 'categories'])
            ->where('status', 'approved')
            ->orderByDesc('featured')
            ->paginate(12);

        return response()->json([
            'category' => $category,
            'businesses' => $businesses,
        ]);
    }
}

