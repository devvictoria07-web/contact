<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Business;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class AdminBusinessController extends Controller
{
    /**
     * Listado administrativo de negocios con filtros avanzados.
     */
    public function index(Request $request): JsonResponse
    {
        $query = Business::with(['city', 'categories', 'user:id,name,email']);

        // Filtro por estado: pending, approved, rejected o all
        if ($request->filled('status') && $request->status !== 'all') {
            $query->where('status', $request->status);
        }

        // Búsqueda por nombre, teléfono, email o nombre del usuario propietario
        if ($request->filled('search')) {
            $search = trim($request->search);
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('phone', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%")
                  ->orWhereHas('user', function ($userQ) use ($search) {
                      $userQ->where('name', 'like', "%{$search}%")
                            ->orWhere('email', 'like', "%{$search}%");
                  });
            });
        }

        if ($request->filled('city_id')) {
            $query->where('city_id', $request->city_id);
        }

        if ($request->filled('category_id')) {
            $query->whereHas('categories', function ($q) use ($request) {
                $q->where('categories.id', $request->category_id);
            });
        }

        $query->orderByDesc('created_at');
        $perPage = min((int) $request->input('per_page', 15), 50);

        return response()->json($query->paginate($perPage));
    }

    /**
     * Ver detalle de cualquier negocio.
     */
    public function show(int $id): JsonResponse
    {
        $business = Business::with(['city', 'categories', 'user:id,name,email,phone'])->findOrFail($id);

        return response()->json($business);
    }

    /**
     * Aprobar o rechazar un negocio registrado.
     */
    public function updateStatus(Request $request, int $id): JsonResponse
    {
        $business = Business::findOrFail($id);

        $validated = $request->validate([
            'status' => ['required', 'in:approved,rejected,pending'],
            'admin_notes' => ['nullable', 'string', 'max:1000'],
        ], [
            'status.required' => 'El estado es obligatorio.',
            'status.in' => 'El estado debe ser approved, rejected o pending.',
        ]);

        $business->update([
            'status' => $validated['status'],
            'admin_notes' => $validated['admin_notes'] ?? null,
        ]);

        $statusText = match ($validated['status']) {
            'approved' => 'aprobado y publicado',
            'rejected' => 'rechazado',
            default => 'marcado como pendiente',
        };

        return response()->json([
            'message' => "El negocio '{$business->name}' ha sido {$statusText} exitosamente.",
            'business' => $business->fresh()->load(['city', 'categories', 'user:id,name,email']),
        ]);
    }

    /**
     * Alternar estado destacado.
     */
    public function toggleFeatured(int $id): JsonResponse
    {
        $business = Business::findOrFail($id);
        $business->featured = !$business->featured;
        $business->save();

        return response()->json([
            'message' => $business->featured ? 'Negocio marcado como destacado.' : 'Negocio retirado de destacados.',
            'featured' => $business->featured,
        ]);
    }

    /**
     * Actualizar datos de un negocio por el administrador.
     */
    public function update(Request $request, int $id): JsonResponse
    {
        $business = Business::findOrFail($id);

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'city_id' => ['required', 'exists:cities,id'],
            'categories' => ['required', 'array', 'min:1'],
            'categories.*' => ['exists:categories,id'],
            'short_description' => ['nullable', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'address' => ['required', 'string', 'max:500'],
            'phone' => ['required', 'string', 'max:50'],
            'whatsapp' => ['nullable', 'string', 'max:50'],
            'email' => ['nullable', 'email', 'max:255'],
            'website' => ['nullable', 'url', 'max:255'],
            'opening_hours' => ['nullable', 'string', 'max:255'],
            'facebook' => ['nullable', 'string', 'max:255'],
            'instagram' => ['nullable', 'string', 'max:255'],
            'status' => ['nullable', 'in:approved,pending,rejected'],
            'admin_notes' => ['nullable', 'string'],
            'featured' => ['nullable', 'boolean'],
            'logo' => ['nullable', 'image', 'mimes:jpeg,png,jpg,webp,svg', 'max:2048'],
        ]);

        $logoPath = $business->logo_path;
        if ($request->hasFile('logo') && $request->file('logo')->isValid()) {
            if ($logoPath && !str_starts_with($logoPath, 'http')) {
                Storage::disk('public')->delete($logoPath);
            }
            $logoPath = $request->file('logo')->store('logos', 'public');
        }

        if ($business->name !== $validated['name']) {
            $baseSlug = Str::slug($validated['name']);
            $slug = $baseSlug;
            $counter = 1;
            while (Business::where('slug', $slug)->where('id', '!=', $business->id)->exists()) {
                $slug = $baseSlug . '-' . $counter;
                $counter++;
            }
            $business->slug = $slug;
        }

        $business->update([
            'city_id' => $validated['city_id'],
            'name' => $validated['name'],
            'short_description' => $validated['short_description'] ?? null,
            'description' => $validated['description'] ?? null,
            'address' => $validated['address'],
            'phone' => $validated['phone'],
            'whatsapp' => $validated['whatsapp'] ?? null,
            'email' => $validated['email'] ?? null,
            'website' => $validated['website'] ?? null,
            'opening_hours' => $validated['opening_hours'] ?? null,
            'facebook' => $validated['facebook'] ?? null,
            'instagram' => $validated['instagram'] ?? null,
            'logo_path' => $logoPath,
            'status' => $validated['status'] ?? $business->status,
            'admin_notes' => $validated['admin_notes'] ?? $business->admin_notes,
            'featured' => isset($validated['featured']) ? (bool) $validated['featured'] : $business->featured,
        ]);

        $business->categories()->sync($validated['categories']);

        return response()->json([
            'message' => 'Negocio actualizado por el administrador.',
            'business' => $business->fresh()->load(['city', 'categories', 'user:id,name,email']),
        ]);
    }

    /**
     * Importar contactos desde una página del Directorio Páginas Amarillas Nicaragua.
     */
    public function importPaginasAmarillas(Request $request): JsonResponse
    {
        $page = $request->input('page', 'all');

        try {
            $exitCode = Artisan::call('paginasamarillas:import', [
                'page' => $page,
            ]);

            $output = Artisan::output();

            if ($exitCode === 0) {
                $msg = ($page === 'all' || $page === 'todo')
                    ? "Directorio completo de Páginas Amarillas Nicaragua 2025 importado exitosamente."
                    : "Contactos de la página {$page} de Páginas Amarillas Nicaragua importados exitosamente.";

                return response()->json([
                    'success' => true,
                    'message' => $msg,
                    'output' => $output,
                ]);
            } else {
                return response()->json([
                    'success' => false,
                    'message' => "No se pudo completar la importación.",
                    'output' => $output,
                ], 422);
            }
        } catch (\Throwable $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al procesar la importación: ' . $e->getMessage(),
            ], 500);
        }
    }
}

