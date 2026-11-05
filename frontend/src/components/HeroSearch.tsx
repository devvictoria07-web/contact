import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, Tag, ArrowRight, BookOpen } from 'lucide-react';
import type { Category, City } from '../types';
import { api } from '../services/api';

interface HeroSearchProps {
  initialSearch?: string;
  initialCategory?: string;
  initialCity?: string;
}

export const HeroSearch: React.FC<HeroSearchProps> = ({
  initialSearch = '',
  initialCategory = '',
  initialCity = '',
}) => {
  const navigate = useNavigate();
  const [search, setSearch] = useState(initialSearch);
  const [category, setCategory] = useState(initialCategory);
  const [city, setCity] = useState(initialCity);

  const [categories, setCategories] = useState<Category[]>([]);
  const [cities, setCities] = useState<City[]>([]);

  useEffect(() => {
    const loadFiltersData = async () => {
      try {
        const [catRes, cityRes] = await Promise.all([
          api.get('/categories'),
          api.get('/cities'),
        ]);
        setCategories(catRes.data);
        setCities(cityRes.data);
      } catch (err) {
        console.error('Error cargando filtros:', err);
      }
    };
    loadFiltersData();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (search.trim()) params.set('search', search.trim());
    if (category) params.set('category', category);
    if (city) params.set('city', city);

    navigate(`/directory?${params.toString()}`);
  };

  return (
    <div className="relative bg-gradient-to-b from-amber-400 via-amber-400 to-amber-300 text-neutral-950 pt-10 pb-16 px-4 sm:px-6 lg:px-8 border-b border-amber-500/30">
      {/* Decorative background pattern */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none"></div>

      <div className="max-w-5xl mx-auto text-center relative z-10">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-neutral-900 text-amber-400 text-xs font-bold px-3.5 py-1.5 rounded-full shadow-sm mb-4">
          <BookOpen className="w-3.5 h-3.5" />
          <span>DIRECTORIO COMERCIAL Y TELEFÓNICO DE NICARAGUA</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-neutral-950 mb-4 uppercase">
          Encuentra lo que necesitas en las <span className="underline decoration-neutral-900 decoration-4">Páginas Amarillas</span>
        </h1>
        <p className="text-base sm:text-lg text-neutral-800 font-medium max-w-2xl mx-auto mb-8">
          Teléfonos, WhatsApp, direcciones y horarios de restaurantes, farmacias, ferreterías, servicios profesionales y más en toda Nicaragua.
        </p>

        {/* Search Bar Container */}
        <form
          onSubmit={handleSearch}
          className="bg-white p-3 sm:p-4 rounded-2xl shadow-xl border-2 border-neutral-900/10 max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-3 items-center text-left"
        >
          {/* Input 1: Palabra clave / Negocio */}
          <div className="md:col-span-5 relative">
            <label className="block text-[11px] font-bold text-neutral-500 uppercase tracking-wider mb-1 pl-1">
              ¿Qué buscas?
            </label>
            <div className="relative flex items-center">
              <Search className="w-5 h-5 text-neutral-400 absolute left-3 pointer-events-none" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Ej. Farmacia, Abogado, Hotel..."
                className="w-full pl-10 pr-3 py-2.5 bg-neutral-50 hover:bg-neutral-100/70 focus:bg-white rounded-xl border border-neutral-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-400/20 text-neutral-900 font-medium text-sm transition-all outline-none"
              />
            </div>
          </div>

          {/* Input 2: Categoría */}
          <div className="md:col-span-3 relative">
            <label className="block text-[11px] font-bold text-neutral-500 uppercase tracking-wider mb-1 pl-1">
              Categoría
            </label>
            <div className="relative flex items-center">
              <Tag className="w-5 h-5 text-neutral-400 absolute left-3 pointer-events-none" />
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full pl-10 pr-8 py-2.5 bg-neutral-50 hover:bg-neutral-100/70 focus:bg-white rounded-xl border border-neutral-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-400/20 text-neutral-900 font-medium text-sm transition-all outline-none appearance-none cursor-pointer truncate"
              >
                <option value="">Todas las categorías</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.slug}>
                    {cat.name} ({cat.businesses_count ?? 0})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Input 3: Ciudad / Departamento */}
          <div className="md:col-span-2 relative">
            <label className="block text-[11px] font-bold text-neutral-500 uppercase tracking-wider mb-1 pl-1">
              Ciudad
            </label>
            <div className="relative flex items-center">
              <MapPin className="w-5 h-5 text-neutral-400 absolute left-3 pointer-events-none" />
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full pl-10 pr-8 py-2.5 bg-neutral-50 hover:bg-neutral-100/70 focus:bg-white rounded-xl border border-neutral-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-400/20 text-neutral-900 font-medium text-sm transition-all outline-none appearance-none cursor-pointer truncate"
              >
                <option value="">Todo el país</option>
                {cities.map((c) => (
                  <option key={c.id} value={c.slug}>
                    {c.name} ({c.department})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Submit Button */}
          <div className="md:col-span-2 flex items-end">
            <button
              type="submit"
              className="w-full h-[44px] mt-auto bg-neutral-950 hover:bg-neutral-800 text-amber-400 font-black rounded-xl text-sm flex items-center justify-center space-x-2 transition-all shadow-md hover:shadow-lg active:scale-95 cursor-pointer"
            >
              <span>Buscar</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>

        {/* Quick Search Badges */}
        <div className="mt-5 flex flex-wrap items-center justify-center gap-2 text-xs">
          <span className="font-bold text-neutral-900 mr-1">Búsquedas frecuentes:</span>
          {['Restaurantes', 'Farmacias', 'Ferreterías', 'Managua', 'León', 'Granada', 'San Juan del Sur'].map((item) => (
            <button
              key={item}
              onClick={() => {
                if (['Managua', 'León', 'Granada', 'San Juan del Sur'].includes(item)) {
                  navigate(`/directory?search=${encodeURIComponent(item)}`);
                } else {
                  navigate(`/directory?search=${encodeURIComponent(item)}`);
                }
              }}
              className="bg-amber-300/80 hover:bg-neutral-950 hover:text-amber-400 text-neutral-900 font-bold px-2.5 py-1 rounded-lg transition-all border border-amber-500/20 cursor-pointer"
            >
              {item}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

