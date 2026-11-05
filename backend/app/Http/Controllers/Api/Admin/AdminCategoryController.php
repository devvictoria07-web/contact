<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

class AdminCategoryController extends Controller
{
    /**
     * Listado completo de categorías para gestión administrativa.
     */
    public function index(): JsonResponse
    {
        $categories = Category::withCount('businesses')
            ->orderBy('name')
            ->get();

        return response()->json($categories);
    }

    /**
     * Crear una nueva categoría.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255', 'unique:categories,name'],
            'icon' => ['nullable', 'string', 'max:100'],
            'description' => ['nullable', 'string', 'max:500'],
        ], [
            'name.required' => 'El nombre de la categoría es obligatorio.',
            'name.unique' => 'Ya existe una categoría con este nombre.',
        ]);

        $category = Category::create([
            'name' => $validated['name'],
            'slug' => Str::slug($validated['name']),
            'icon' => $validated['icon'] ?? 'Briefcase',
            'description' => $validated['description'] ?? null,
        ]);

        return response()->json([
            'message' => 'Categoría creada exitosamente.',
            'category' => $category->loadCount('businesses'),
        ], 201);
    }

    /**
     * Actualizar categoría existente.
     */
    public function update(Request $request, int $id): JsonResponse
    {
        $category = Category::findOrFail($id);

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255', Rule::unique('categories', 'name')->ignore($category->id)],
            'icon' => ['nullable', 'string', 'max:100'],
            'description' => ['nullable', 'string', 'max:500'],
        ], [
            'name.required' => 'El nombre de la categoría es obligatorio.',
            'name.unique' => 'Ya existe una categoría con este nombre.',
        ]);

        $category->update([
            'name' => $validated['name'],
            'slug' => Str::slug($validated['name']),
            'icon' => $validated['icon'] ?? $category->icon,
            'description' => $validated['description'] ?? null,
        ]);

        return response()->json([
            'message' => 'Categoría actualizada exitosamente.',
            'category' => $category->fresh()->loadCount('businesses'),
        ]);
    }

    /**
     * Eliminar categoría.
     */
    public function destroy(int $id): JsonResponse
    {
        $category = Category::findOrFail($id);
        $businessCount = $category->businesses()->count();

        if ($businessCount > 0) {
            // Desvincular de negocios sin romperlos
            $category->businesses()->detach();
        }

        $category->delete();

        return response()->json([
            'message' => 'Categoría eliminada exitosamente.',
        ]);
    }
}

