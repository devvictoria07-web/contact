import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import type { City } from '../types';
import { MapPin, Building2 } from 'lucide-react';

export const CitiesPage: React.FC = () => {
  const [cities, setCities] = useState<City[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCities = async () => {
      try {
        const res = await api.get('/cities');
        setCities(res.data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchCities();
  }, []);

  // Agrupar por departamento
  const grouped = cities.reduce((acc: Record<string, City[]>, city) => {
    const dept = city.department || 'Otros';
    if (!acc[dept]) acc[dept] = [];
    acc[dept].push(city);
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-neutral-50 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-neutral-200 shadow-2xs">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded bg-amber-400"></span>
            <span className="text-xs font-bold text-neutral-500 uppercase tracking-wider">
              Cobertura Territorial
            </span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-neutral-900 mt-1">
            Ciudades y Departamentos de Nicaragua
          </h1>
          <p className="text-xs sm:text-sm text-neutral-600 mt-1 max-w-2xl">
            Encuentra empresas, oficinas y servicios en tu municipio o departamento.
          </p>
        </div>

        {loading ? (
          <div className="py-16 text-center">
            <div className="w-8 h-8 border-4 border-amber-400 border-t-neutral-900 rounded-full animate-spin mx-auto mb-2"></div>
            <p className="text-xs font-bold text-neutral-500">Cargando ubicaciones...</p>
          </div>
        ) : (
          <div className="space-y-8">
            {Object.entries(grouped).map(([department, deptCities]) => (
              <div key={department} className="bg-white p-6 rounded-3xl border border-neutral-200 shadow-2xs">
                <div className="flex items-center gap-2 mb-4 border-b border-neutral-100 pb-3">
                  <MapPin className="w-5 h-5 text-amber-500" />
                  <h2 className="text-lg font-black text-neutral-900">
                    Departamento de {department}
                  </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {deptCities.map((city) => (
                    <Link
                      key={city.id}
                      to={`/directory?city=${city.slug}`}
                      className="p-3.5 rounded-xl border border-neutral-200 hover:border-amber-400 bg-neutral-50/50 hover:bg-amber-50/50 transition-all flex items-center justify-between group"
                    >
                      <div className="flex items-center space-x-2">
                        <Building2 className="w-4 h-4 text-neutral-400 group-hover:text-amber-600 transition-colors" />
                        <span className="text-xs font-bold text-neutral-800 group-hover:text-neutral-950">
                          {city.name}
                        </span>
                      </div>
                      <span className="text-[11px] font-semibold text-neutral-500 bg-white px-2 py-0.5 rounded-full border border-neutral-200">
                        {city.businesses_count ?? 0}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
