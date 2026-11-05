import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { BusinessCard } from '../components/BusinessCard';
import { Pagination } from '../components/Pagination';
import { SkeletonGrid } from '../components/LoadingSkeleton';
import { api } from '../services/api';
import type { Business, Category, City, PaginatedResponse } from '../types';
import {
  Search,
  Filter,
  X,
  MapPin,
  Tag,
  Award,
  RotateCcw,
  Building2,
  SlidersHorizontal,
} from 'lucide-react';

export const DirectoryPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const searchParam = searchParams.get('search') || '';
  const categoryParam = searchParams.get('category') || '';
  const cityParam = searchParams.get('city') || '';
  const featuredParam = searchParams.get('featured') === 'true';
  const pageParam = parseInt(searchParams.get('page') || '1', 10);

  const [businessesData, setBusinessesData] = useState<PaginatedResponse<Business> | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [loading, setLoading] = useState(true);

  // Local filter states
  const [searchTerm, setSearchTerm] = useState(searchParam);
  const [selectedCategory, setSelectedCategory] = useState(categoryParam);
  const [selectedCity, setSelectedCity] = useState(cityParam);
  const [onlyFeatured, setOnlyFeatured] = useState(featuredParam);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Sincronizar estados locales cuando cambie URL
  useEffect(() => {
    setSearchTerm(searchParam);
    setSelectedCategory(categoryParam);
    setSelectedCity(cityParam);
    setOnlyFeatured(featuredParam);
  }, [searchParam, categoryParam, cityParam, featuredParam]);

  // Cargar categorías y ciudades para los filtros
  useEffect(() => {
    const loadFiltersData = async () => {
      try {
        const [catRes, cityRes] = await Promise.all([
          api.get('/categories'),
          api.get('/cities'),
        ]);
        setCategories(catRes.data);
        setCities(cityRes.data);
      } catch (e) {
        console.error(e);
      }
    };
    loadFiltersData();
  }, []);

  // Cargar negocios según filtros activos
  useEffect(() => {
    const fetchBusinesses = async () => {
      setLoading(true);
      try {
        const params: Record<string, any> = {
          page: pageParam,
          per_page: 12,
        };
        if (searchParam) params.search = searchParam;
        if (categoryParam) params.category = categoryParam;
        if (cityParam) params.city = cityParam;
        if (featuredParam) params.featured = 1;

        const res = await api.get('/businesses', { params });
        setBusinessesData(res.data);
      } catch (err) {
        console.error('Error cargando negocios:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchBusinesses();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [searchParam, categoryParam, cityParam, featuredParam, pageParam]);

  // Aplicar filtros a la URL
  const applyFilters = (newParams?: Record<string, string | boolean | number>) => {
    const params = new URLSearchParams();
    const finalSearch = newParams?.search !== undefined ? newParams.search : searchTerm;
    const finalCategory = newParams?.category !== undefined ? newParams.category : selectedCategory;
    const finalCity = newParams?.city !== undefined ? newParams.city : selectedCity;
    const finalFeatured = newParams?.featured !== undefined ? newParams.featured : onlyFeatured;

    if (finalSearch && typeof finalSearch === 'string' && finalSearch.trim()) {
      params.set('search', finalSearch.trim());
    }
    if (finalCategory) params.set('category', String(finalCategory));
    if (finalCity) params.set('city', String(finalCity));
    if (finalFeatured) params.set('featured', 'true');

    // Resetear a página 1 cuando se aplican nuevos filtros
    params.set('page', '1');

    setSearchParams(params);
    setMobileFiltersOpen(false);
  };

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', String(page));
    setSearchParams(params);
  };

  const clearAllFilters = () => {
    setSearchTerm('');
    setSelectedCategory('');
    setSelectedCity('');
    setOnlyFeatured(false);
    setSearchParams({});
  };

  const activeCategoryObj = categories.find(
    (c) => c.slug === categoryParam || String(c.id) === categoryParam
  );
  const activeCityObj = cities.find(
    (c) => c.slug === cityParam || String(c.id) === cityParam
  );

  return (
    <div className="min-h-screen bg-neutral-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Cabecera del Directorio */}
        <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-2xs mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded bg-amber-400"></span>
                <h1 className="text-2xl sm:text-3xl font-black text-neutral-900 tracking-tight">
                  Directorio Comercial de Nicaragua
                </h1>
              </div>
              <p className="text-xs text-neutral-500 mt-1">
                Explora contactos telefónicos, direcciones, WhatsApp y horarios de empresas locales
              </p>
            </div>

            {/* Buscador de barra superior */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                applyFilters();
              }}
              className="flex items-center gap-2 max-w-md w-full"
            >
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Buscar por nombre, producto o dirección..."
                  className="w-full pl-9 pr-3 py-2 bg-neutral-100 focus:bg-white rounded-xl border border-neutral-200 focus:border-amber-500 text-xs font-medium outline-none transition-all"
                />
              </div>
              <button
                type="submit"
                className="bg-amber-400 hover:bg-amber-500 text-neutral-950 px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer shrink-0"
              >
                Buscar
              </button>
            </form>
          </div>

          {/* Active Filter Chips */}
          {(searchParam || categoryParam || cityParam || featuredParam) && (
            <div className="flex flex-wrap items-center gap-2 mt-4 pt-4 border-t border-neutral-100 text-xs">
              <span className="font-bold text-neutral-500">Filtros activos:</span>

              {searchParam && (
                <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-900 font-bold px-2.5 py-1 rounded-lg">
                  <span>Texto: "{searchParam}"</span>
                  <button
                    onClick={() => applyFilters({ search: '' })}
                    className="hover:text-red-600 cursor-pointer"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}

              {activeCategoryObj && (
                <span className="inline-flex items-center gap-1 bg-neutral-100 text-neutral-800 font-bold px-2.5 py-1 rounded-lg">
                  <Tag className="w-3 h-3 text-amber-600" />
                  <span>{activeCategoryObj.name}</span>
                  <button
                    onClick={() => applyFilters({ category: '' })}
                    className="hover:text-red-600 cursor-pointer"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}

              {activeCityObj && (
                <span className="inline-flex items-center gap-1 bg-neutral-100 text-neutral-800 font-bold px-2.5 py-1 rounded-lg">
                  <MapPin className="w-3 h-3 text-amber-600" />
                  <span>
                    {activeCityObj.name} ({activeCityObj.department})
                  </span>
                  <button
                    onClick={() => applyFilters({ city: '' })}
                    className="hover:text-red-600 cursor-pointer"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}

              {featuredParam && (
                <span className="inline-flex items-center gap-1 bg-amber-400 text-neutral-950 font-bold px-2.5 py-1 rounded-lg">
                  <Award className="w-3.5 h-3.5" />
                  <span>Solo Destacados</span>
                  <button
                    onClick={() => applyFilters({ featured: false })}
                    className="hover:text-red-600 cursor-pointer"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}

              <button
                onClick={clearAllFilters}
                className="text-xs text-neutral-500 hover:text-red-600 font-bold underline ml-2 cursor-pointer"
              >
                Limpiar todos
              </button>
            </div>
          )}
        </div>

        {/* Layout Grid: Filtros laterales + Listado */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Botón para abrir filtros en móvil */}
          <div className="lg:hidden">
            <button
              onClick={() => setMobileFiltersOpen(true)}
              className="w-full flex items-center justify-center gap-2 bg-white border border-neutral-300 text-neutral-800 font-bold py-2.5 px-4 rounded-xl shadow-xs"
            >
              <SlidersHorizontal className="w-4 h-4 text-amber-500" />
              <span>Filtrar por Categoría o Ciudad</span>
            </button>
          </div>

          {/* Filtros de barra lateral (Desktop) */}
          <aside className="hidden lg:block space-y-6">
            <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-2xs space-y-5">
              <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
                <span className="font-bold text-sm text-neutral-900 flex items-center gap-2">
                  <Filter className="w-4 h-4 text-amber-500" />
                  Filtrar Resultados
                </span>
                <button
                  onClick={clearAllFilters}
                  className="text-[11px] text-amber-600 hover:underline font-bold"
                >
                  Restablecer
                </button>
              </div>

              {/* Categorías */}
              <div>
                <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-2">
                  Rubros Comerciales
                </label>
                <div className="space-y-1 max-h-56 overflow-y-auto pr-1">
                  <button
                    onClick={() => applyFilters({ category: '' })}
                    className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center justify-between transition-colors ${
                      !categoryParam
                        ? 'bg-amber-400 text-neutral-950 font-bold'
                        : 'text-neutral-600 hover:bg-neutral-100'
                    }`}
                  >
                    <span>Todas las categorías</span>
                  </button>
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => applyFilters({ category: cat.slug })}
                      className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium flex items-center justify-between transition-colors ${
                        categoryParam === cat.slug || categoryParam === String(cat.id)
                          ? 'bg-amber-400 text-neutral-950 font-bold'
                          : 'text-neutral-600 hover:bg-neutral-100'
                      }`}
                    >
                      <span className="truncate">{cat.name}</span>
                      <span className="text-[10px] text-neutral-400 font-bold">
                        {cat.businesses_count ?? 0}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Ciudades */}
              <div className="border-t border-neutral-100 pt-4">
                <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-2">
                  Ciudades / Departamentos
                </label>
                <div className="space-y-1 max-h-56 overflow-y-auto pr-1">
                  <button
                    onClick={() => applyFilters({ city: '' })}
                    className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center justify-between transition-colors ${
                      !cityParam
                        ? 'bg-amber-400 text-neutral-950 font-bold'
                        : 'text-neutral-600 hover:bg-neutral-100'
                    }`}
                  >
                    <span>Toda Nicaragua</span>
                  </button>
                  {cities.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => applyFilters({ city: c.slug })}
                      className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium flex items-center justify-between transition-colors ${
                        cityParam === c.slug || cityParam === String(c.id)
                          ? 'bg-amber-400 text-neutral-950 font-bold'
                          : 'text-neutral-600 hover:bg-neutral-100'
                      }`}
                    >
                      <span className="truncate">
                        {c.name} ({c.department})
                      </span>
                      <span className="text-[10px] text-neutral-400 font-bold">
                        {c.businesses_count ?? 0}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Checkbox destacados */}
              <div className="border-t border-neutral-100 pt-4">
                <label className="flex items-center space-x-2 text-xs font-semibold text-neutral-800 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={onlyFeatured}
                    onChange={(e) => applyFilters({ featured: e.target.checked })}
                    className="w-4 h-4 text-amber-500 rounded border-neutral-300 focus:ring-amber-400"
                  />
                  <span>Mostrar solo destacados</span>
                </label>
              </div>
            </div>
          </aside>

          {/* Listado de Negocios */}
          <main className="lg:col-span-3">
            {loading ? (
              <SkeletonGrid count={6} />
            ) : businessesData && businessesData.data.length > 0 ? (
              <div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {businessesData.data.map((business) => (
                    <BusinessCard key={business.id} business={business} />
                  ))}
                </div>

                {/* Pagination */}
                <Pagination
                  currentPage={businessesData.current_page}
                  lastPage={businessesData.last_page}
                  total={businessesData.total}
                  from={businessesData.from}
                  to={businessesData.to}
                  onPageChange={handlePageChange}
                />
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-neutral-200 p-12 text-center">
                <div className="w-16 h-16 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mx-auto mb-4">
                  <Building2 className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-neutral-900 mb-1">
                  No se encontraron negocios con esos criterios
                </h3>
                <p className="text-xs text-neutral-500 max-w-md mx-auto mb-6">
                  Intenta buscar con palabras más generales, seleccionando otra ciudad o borrando los filtros activos.
                </p>
                <button
                  onClick={clearAllFilters}
                  className="inline-flex items-center space-x-2 bg-neutral-900 text-amber-400 font-bold px-4 py-2 rounded-xl text-xs hover:bg-neutral-800 transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Restablecer Filtros de Búsqueda</span>
                </button>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Modal / Drawer de filtros en móvil */}
      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-50 flex bg-neutral-900/60 backdrop-blur-xs lg:hidden">
          <div className="ml-auto w-full max-w-xs bg-white h-full p-6 overflow-y-auto space-y-6">
            <div className="flex items-center justify-between border-b pb-3">
              <span className="font-bold text-base text-neutral-900">Filtros</span>
              <button
                onClick={() => setMobileFiltersOpen(false)}
                className="p-1 rounded-lg text-neutral-500 hover:bg-neutral-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Categorías en móvil */}
            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-2">Categoría</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full p-2.5 rounded-lg border border-neutral-300 text-xs font-medium"
              >
                <option value="">Todas las categorías</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.slug}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Ciudades en móvil */}
            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-2">Ciudad</label>
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="w-full p-2.5 rounded-lg border border-neutral-300 text-xs font-medium"
              >
                <option value="">Toda Nicaragua</option>
                {cities.map((c) => (
                  <option key={c.id} value={c.slug}>
                    {c.name} ({c.department})
                  </option>
                ))}
              </select>
            </div>

            {/* Solo destacados */}
            <div>
              <label className="flex items-center space-x-2 text-xs font-semibold text-neutral-800">
                <input
                  type="checkbox"
                  checked={onlyFeatured}
                  onChange={(e) => setOnlyFeatured(e.target.checked)}
                  className="w-4 h-4 text-amber-500 rounded"
                />
                <span>Solo Destacados</span>
              </label>
            </div>

            <div className="pt-4 space-y-2">
              <button
                onClick={() => applyFilters()}
                className="w-full bg-amber-400 hover:bg-amber-500 text-neutral-950 font-bold py-2.5 rounded-xl text-xs transition-colors"
              >
                Aplicar Filtros
              </button>
              <button
                onClick={() => {
                  clearAllFilters();
                  setMobileFiltersOpen(false);
                }}
                className="w-full border border-neutral-300 text-neutral-700 font-bold py-2.5 rounded-xl text-xs hover:bg-neutral-50"
              >
                Limpiar Todo
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

