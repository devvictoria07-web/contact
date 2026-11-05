import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import type { Category } from '../types';
import { CategoryIcon } from '../components/CategoryIcon';
import { ArrowRight } from 'lucide-react';

export const CategoriesPage: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCats = async () => {
      try {
        const res = await api.get('/categories');
        setCategories(res.data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchCats();
  }, []);

  return (
    <div className="min-h-screen bg-neutral-50 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-neutral-200 shadow-2xs">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded bg-amber-400"></span>
            <span className="text-xs font-bold text-neutral-500 uppercase tracking-wider">
              Catálogo Comercial
            </span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-neutral-900 mt-1">
            Rubros y Categorías de Negocios
          </h1>
          <p className="text-xs sm:text-sm text-neutral-600 mt-1 max-w-2xl">
            Encuentra empresas y profesionales clasificados por actividad económica en toda Nicaragua.
          </p>
        </div>

        {/* Grid de Categorías */}
        {loading ? (
          <div className="py-16 text-center">
            <div className="w-8 h-8 border-4 border-amber-400 border-t-neutral-900 rounded-full animate-spin mx-auto mb-2"></div>
            <p className="text-xs font-bold text-neutral-500">Cargando categorías...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                to={`/directory?category=${cat.slug}`}
                className="bg-white p-5 rounded-2xl border border-neutral-200 hover:border-amber-400 shadow-2xs hover:shadow-md transition-all group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-amber-100 group-hover:bg-amber-400 text-neutral-900 flex items-center justify-center transition-colors">
                      <CategoryIcon name={cat.icon || cat.name} className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-bold bg-neutral-100 group-hover:bg-amber-100 text-neutral-700 px-2.5 py-1 rounded-full">
                      {cat.businesses_count ?? 0} contactos
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-neutral-900 group-hover:text-neutral-950">
                    {cat.name}
                  </h3>
                  {cat.description && (
                    <p className="text-xs text-neutral-500 mt-1 leading-relaxed line-clamp-2">
                      {cat.description}
                    </p>
                  )}
                </div>

                <div className="mt-4 pt-3 border-t border-neutral-100 flex items-center justify-between text-xs font-bold text-amber-600">
                  <span>Ver directorio</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
