<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Business;
use App\Models\Category;
use App\Models\City;
use App\Models\User;
use Illuminate\Http\JsonResponse;

class StatsController extends Controller
{
    /**
     * Estadísticas públicas para la portada.
     */
    public function publicStats(): JsonResponse
    {
        return response()->json([
            'total_businesses' => Business::where('status', 'approved')->count(),
            'total_categories' => Category::count(),
            'total_cities' => City::count(),
            'departments_covered' => City::distinct('department')->count('department'),
        ]);
    }

    /**
     * Resumen completo para el dashboard de administración.
     */
    public function adminStats(): JsonResponse
    {
        $totalBusinesses = Business::count();
        $approvedBusinesses = Business::where('status', 'approved')->count();
        $pendingBusinesses = Business::where('status', 'pending')->count();
        $rejectedBusinesses = Business::where('status', 'rejected')->count();

        $totalUsers = User::count();
        $ownersCount = User::where('role', 'owner')->count();
        $visitorsCount = User::where('role', 'visitor')->count();

        $latestPending = Business::with(['city', 'user:id,name,email'])
            ->where('status', 'pending')
            ->orderByDesc('created_at')
            ->take(5)
            ->get();

        return response()->json([
            'businesses' => [
                'total' => $totalBusinesses,
                'approved' => $approvedBusinesses,
                'pending' => $pendingBusinesses,
                'rejected' => $rejectedBusinesses,
            ],
            'users' => [
                'total' => $totalUsers,
                'owners' => $ownersCount,
                'visitors' => $visitorsCount,
            ],
            'categories_count' => Category::count(),
            'cities_count' => City::count(),
            'latest_pending' => $latestPending,
        ]);
    }
}

