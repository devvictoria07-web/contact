<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Business;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class OwnerBusinessController extends Controller
{
    /**
     * Listado de los negocios del usuario autenticado.
     */
    public function index(Request $request): JsonResponse
    {
        $businesses = $request->user()
            ->businesses()
            ->with(['city', 'categories'])
            ->orderByDesc('created_at')
            ->get();

        return response()->json($businesses);
    }

    /**
     * Registro de un nuevo negocio por parte del propietario.
     */
    public function store(Request $request): JsonResponse
    {
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
            'logo' => ['nullable', 'image', 'mimes:jpeg,png,jpg,webp,svg', 'max:2048'],
        ], [
            'name.required' => 'El nombre del negocio es obligatorio.',
            'city_id.required' => 'Debe seleccionar una ciudad o departamento.',
            'city_id.exists' => 'La ciudad seleccionada no es válida.',
            'categories.required' => 'Debe seleccionar al menos una categoría.',
            'categories.min' => 'Seleccione al menos una categoría.',
            'address.required' => 'La dirección física es obligatoria.',
            'phone.required' => 'El teléfono de contacto es obligatorio.',
            'email.email' => 'El correo electrónico no tiene un formato válido.',
            'website.url' => 'El sitio web debe ser una URL válida (ej. https://ejemplo.com).',
            'logo.image' => 'El archivo del logo debe ser una imagen.',
            'logo.mimes' => 'El logo debe ser de tipo: jpeg, png, jpg, webp o svg.',
            'logo.max' => 'El tamaño máximo del logo es de 2 MB (2048 KB).',
        ]);

        $logoPath = null;
        if ($request->hasFile('logo') && $request->file('logo')->isValid()) {
            $logoPath = $request->file('logo')->store('logos', 'public');
        }

        // Generar slug único
        $baseSlug = Str::slug($validated['name']);
        $slug = $baseSlug;
        $counter = 1;
        while (Business::where('slug', $slug)->exists()) {
            $slug = $baseSlug . '-' . $counter;
            $counter++;
        }

        $business = Business::create([
            'user_id' => $request->user()->id,
            'city_id' => $validated['city_id'],
            'name' => $validated['name'],
            'slug' => $slug,
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
            'status' => 'pending', // Requiere aprobación del administrador
            'admin_notes' => null,
            'featured' => false,
        ]);

        $business->categories()->sync($validated['categories']);

        return response()->json([
            'message' => '¡Negocio registrado exitosamente! Su publicación quedará visible una vez sea revisada y aprobada por el administrador.',
            'business' => $business->load(['city', 'categories']),
        ], 201);
    }

    /**
     * Ver datos de un negocio perteneciente al usuario.
     */
    public function show(Request $request, int $id): JsonResponse
    {
        $business = $request->user()
            ->businesses()
            ->with(['city', 'categories'])
            ->findOrFail($id);

        return response()->json($business);
    }

    /**
     * Actualizar datos del negocio por parte del propietario.
     */
    public function update(Request $request, int $id): JsonResponse
    {
        $business = $request->user()
            ->businesses()
            ->findOrFail($id);

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
            'logo' => ['nullable', 'image', 'mimes:jpeg,png,jpg,webp,svg', 'max:2048'],
        ], [
            'name.required' => 'El nombre del negocio es obligatorio.',
            'city_id.required' => 'Debe seleccionar una ciudad o departamento.',
            'categories.required' => 'Debe seleccionar al menos una categoría.',
            'address.required' => 'La dirección física es obligatoria.',
            'phone.required' => 'El teléfono de contacto es obligatorio.',
            'logo.max' => 'El tamaño máximo del logo es de 2 MB (2048 KB).',
        ]);

        $logoPath = $business->logo_path;

        if ($request->hasFile('logo') && $request->file('logo')->isValid()) {
            // Eliminar logo anterior si estaba en local public disk
            if ($logoPath && !str_starts_with($logoPath, 'http')) {
                Storage::disk('public')->delete($logoPath);
            }
            $logoPath = $request->file('logo')->store('logos', 'public');
        }

        // Actualizar slug si el nombre cambió
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
            // Si estaba rechazado, al editarlo pasa a 'pending' para reconsideración
            'status' => $business->status === 'rejected' ? 'pending' : $business->status,
        ]);

        $business->categories()->sync($validated['categories']);

        return response()->json([
            'message' => 'Información del negocio actualizada correctamente.',
            'business' => $business->fresh()->load(['city', 'categories']),
        ]);
    }

    /**
     * Eliminar negocio del propietario.
     */
    public function destroy(Request $request, int $id): JsonResponse
    {
        $business = $request->user()
            ->businesses()
            ->findOrFail($id);

        if ($business->logo_path && !str_starts_with($business->logo_path, 'http')) {
            Storage::disk('public')->delete($business->logo_path);
        }

        $business->delete();

        return response()->json([
            'message' => 'Negocio eliminado exitosamente.',
        ]);
    }
}

