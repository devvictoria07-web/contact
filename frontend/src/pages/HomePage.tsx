import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { HeroSearch } from '../components/HeroSearch';
import { CategoryGrid } from '../components/CategoryGrid';
import { BusinessCard } from '../components/BusinessCard';
import { SkeletonGrid } from '../components/LoadingSkeleton';
import { api } from '../services/api';
import type { Business, Category, PublicStats } from '../types';
import {
  Award,
  ArrowRight,
  ShieldCheck,
  PhoneCall,
  Search,
  Building,
} from 'lucide-react';

export const HomePage: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [featuredBusinesses, setFeaturedBusinesses] = useState<Business[]>([]);
  const [recentBusinesses, setRecentBusinesses] = useState<Business[]>([]);
  const [stats, setStats] = useState<PublicStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadHomeData = async () => {
      try {
        const [catRes, featRes, recentRes, statsRes] = await Promise.all([
          api.get('/categories'),
          api.get('/businesses/featured'),
          api.get('/businesses?per_page=6'),
          api.get('/stats'),
        ]);

        setCategories(catRes.data);
        setFeaturedBusinesses(featRes.data);
        setRecentBusinesses(recentRes.data.data);
        setStats(statsRes.data);
      } catch (err) {
        console.error('Error cargando datos de inicio:', err);
      } finally {
        setLoading(false);
      }
    };

    loadHomeData();
  }, []);

  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col">
      {/* 1. Hero Search */}
      <HeroSearch />

      {/* 2. Stats Ticker */}
      <div className="bg-white border-b border-neutral-200 py-4 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center divide-x divide-neutral-100">
            <div className="p-2">
              <span className="block text-2xl sm:text-3xl font-black text-neutral-900">
                {stats?.total_businesses ?? 15}+
              </span>
              <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                Negocios en Directorio
              </span>
            </div>
            <div className="p-2">
              <span className="block text-2xl sm:text-3xl font-black text-amber-500">
                {stats?.total_categories ?? 10}
              </span>
              <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                Rubros Comerciales
              </span>
            </div>
            <div className="p-2">
              <span className="block text-2xl sm:text-3xl font-black text-neutral-900">
                {stats?.total_cities ?? 13}
              </span>
              <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                Ciudades y Municipios
              </span>
            </div>
            <div className="p-2">
              <span className="block text-2xl sm:text-3xl font-black text-amber-500">
                {stats?.departments_covered ?? 12}
              </span>
              <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                Departamentos Cubiertos
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
        {/* 3. Categorías Populares */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
                <h2 className="text-2xl font-black text-neutral-900 tracking-tight">
                  Explorar por Rubros y Categorías
                </h2>
              </div>
              <p className="text-xs text-neutral-500 mt-1">
                Localiza rápidamente los comercios y servicios organizados por sector
              </p>
            </div>
            <Link
              to="/categories"
              className="text-xs font-bold text-amber-600 hover:text-amber-700 flex items-center gap-1 group"
            >
              <span>Ver todos los rubros</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <CategoryGrid categories={categories} limit={10} />
        </section>

        {/* 4. Negocios Destacados */}
        {featuredBusinesses.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-6">
              <div>
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-amber-500" />
                  <h2 className="text-2xl font-black text-neutral-900 tracking-tight">
                    Negocios Destacados de Nicaragua
                  </h2>
                </div>
                <p className="text-xs text-neutral-500 mt-1">
                  Empresas reconocidas con atención verificada y contactos directos
                </p>
              </div>
              <Link
                to="/directory?featured=true"
                className="text-xs font-bold text-amber-600 hover:text-amber-700 flex items-center gap-1 group"
              >
                <span>Ver todos los destacados</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            {loading ? (
              <SkeletonGrid count={3} />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {featuredBusinesses.map((b) => (
                  <BusinessCard key={b.id} business={b} />
                ))}
              </div>
            )}
          </section>
        )}

        {/* 5. Directorio Reciente */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-neutral-900"></span>
                <h2 className="text-2xl font-black text-neutral-900 tracking-tight">
                  Últimos Negocios Publicados
                </h2>
              </div>
              <p className="text-xs text-neutral-500 mt-1">
                Nuevos contactos comerciales añadidos recientemente al catálogo
              </p>
            </div>
            <Link
              to="/directory"
              className="text-xs font-bold text-neutral-900 hover:text-amber-600 flex items-center gap-1 group"
            >
              <span>Explorar catálogo completo</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {loading ? (
            <SkeletonGrid count={6} />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recentBusinesses.map((b) => (
                <BusinessCard key={b.id} business={b} />
              ))}
            </div>
          )}

          <div className="mt-8 text-center">
            <Link
              to="/directory"
              className="inline-flex items-center space-x-2 bg-neutral-900 hover:bg-neutral-800 text-amber-400 font-bold px-6 py-3 rounded-xl text-sm transition-all shadow-md"
            >
              <Search className="w-4 h-4" />
              <span>Ver Todos los Negocios en el Directorio</span>
            </Link>
          </div>
        </section>

        {/* 6. Beneficios / Trust Badges */}
        <section className="bg-amber-100/60 rounded-3xl p-8 sm:p-12 border border-amber-300/50">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h3 className="text-2xl sm:text-3xl font-black text-neutral-900 uppercase">
              ¿Por qué buscar en Páginas Amarillas Nicaragua?
            </h3>
            <p className="text-sm text-neutral-700 mt-2">
              El canal más directo para conectar consumidores nicaragüenses con proveedores locales confiables.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-amber-200/60 shadow-2xs">
              <div className="w-12 h-12 rounded-xl bg-amber-400 text-neutral-950 flex items-center justify-center font-bold mb-4">
                <PhoneCall className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-base text-neutral-900 mb-1">Contacto Directo</h4>
              <p className="text-xs text-neutral-600 leading-relaxed">
                Accede a números de teléfono directos y botones de WhatsApp para cotizar o pedir información al instante sin intermediarios.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-amber-200/60 shadow-2xs">
              <div className="w-12 h-12 rounded-xl bg-amber-400 text-neutral-950 flex items-center justify-center font-bold mb-4">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-base text-neutral-900 mb-1">Negocios Verificados</h4>
              <p className="text-xs text-neutral-600 leading-relaxed">
                Cada empresa pasa por un proceso de revisión y aprobación administrativa antes de su publicación en el portal nacional.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-amber-200/60 shadow-2xs">
              <div className="w-12 h-12 rounded-xl bg-amber-400 text-neutral-950 flex items-center justify-center font-bold mb-4">
                <Building className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-base text-neutral-900 mb-1">Cobertura Nacional</h4>
              <p className="text-xs text-neutral-600 leading-relaxed">
                Directorio disponible en los 15 departamentos y regiones autónomas de Nicaragua: Managua, León, Granada, Matagalpa, Estelí y más.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
