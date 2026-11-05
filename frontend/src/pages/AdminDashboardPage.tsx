import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api, getErrorMessage } from '../services/api';
import type { AdminStats, Business, Category, City } from '../types';
import {
  ShieldCheck,
  Building2,
  Clock,
  CheckCircle2,
  Award,
  Trash2,
  Edit,
  Eye,
  Plus,
  Tag,
  MapPin,
  Search,
  Check,
  X,
  Download,
  Globe,
} from 'lucide-react';

export const AdminDashboardPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'pending' | 'all' | 'categories' | 'cities' | 'import'>('pending');
  const [stats, setStats] = useState<AdminStats | null>(null);

  // Importador Páginas Amarillas
  const [importPage, setImportPage] = useState('20');
  const [importing, setImporting] = useState(false);
  const [importResult, setImportResult] = useState<{ success: boolean; message: string; output?: string } | null>(null);

  // Negocios
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  // Categorías & Ciudades
  const [categories, setCategories] = useState<Category[]>([]);
  const [cities, setCities] = useState<City[]>([]);

  // Modal Rechazar
  const [rejectModalBiz, setRejectModalBiz] = useState<Business | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [processingStatus, setProcessingStatus] = useState(false);

  // Modal Nueva/Editar Categoría
  const [catModalOpen, setCatModalOpen] = useState(false);
  const [editingCat, setEditingCat] = useState<Category | null>(null);
  const [catName, setCatName] = useState('');
  const [catIcon, setCatIcon] = useState('Briefcase');
  const [catDesc, setCatDesc] = useState('');

  // Modal Nueva/Editar Ciudad
  const [cityModalOpen, setCityModalOpen] = useState(false);
  const [editingCity, setEditingCity] = useState<City | null>(null);
  const [cityName, setCityName] = useState('');
  const [cityDept, setCityDept] = useState('');

  const [message, setMessage] = useState<string | null>(null);

  const fetchStats = async () => {
    try {
      const res = await api.get('/admin/stats');
      setStats(res.data);
    } catch (e) {
      console.error(e);
    }
  };

  const fetchBusinesses = async () => {
    setLoading(true);
    try {
      const params: any = { per_page: 50 };
      if (activeTab === 'pending') {
        params.status = 'pending';
      } else {
        if (statusFilter !== 'all') params.status = statusFilter;
      }
      if (searchQuery.trim()) params.search = searchQuery.trim();

      const res = await api.get('/admin/businesses', { params });
      setBusinesses(res.data.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await api.get('/admin/categories');
      setCategories(res.data);
    } catch (e) {
      console.error(e);
    }
  };

  const fetchCities = async () => {
    try {
      const res = await api.get('/admin/cities');
      setCities(res.data);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchStats();
    fetchCategories();
    fetchCities();
  }, []);

  useEffect(() => {
    if (activeTab === 'pending' || activeTab === 'all') {
      fetchBusinesses();
    } else if (activeTab === 'categories') {
      fetchCategories();
    } else if (activeTab === 'cities') {
      fetchCities();
    }
  }, [activeTab, statusFilter]);

  // Acciones sobre Negocios
  const handleUpdateStatus = async (id: number, status: 'approved' | 'rejected', notes?: string) => {
    setProcessingStatus(true);
    try {
      const res = await api.put(`/admin/businesses/${id}/status`, {
        status,
        admin_notes: notes || null,
      });
      setMessage(res.data.message);
      setRejectModalBiz(null);
      setRejectReason('');
      fetchStats();
      fetchBusinesses();
    } catch (err: any) {
      alert(getErrorMessage(err));
    } finally {
      setProcessingStatus(false);
    }
  };

  const handleToggleFeatured = async (id: number) => {
    try {
      const res = await api.put(`/admin/businesses/${id}/toggle-featured`);
      setMessage(res.data.message);
      fetchBusinesses();
    } catch (err: any) {
      alert(getErrorMessage(err));
    }
  };

  const handleDeleteBusiness = async (id: number, name: string) => {
    if (!window.confirm(`¿Estás seguro de eliminar permanentemente el negocio "${name}"?`)) return;
    try {
      const res = await api.delete(`/admin/businesses/${id}`);
      setMessage(res.data.message);
      fetchStats();
      fetchBusinesses();
    } catch (err: any) {
      alert(getErrorMessage(err));
    }
  };

  // CRUD Categorías
  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingCat) {
        await api.put(`/admin/categories/${editingCat.id}`, {
          name: catName,
          icon: catIcon,
          description: catDesc,
        });
        setMessage('Categoría actualizada exitosamente.');
      } else {
        await api.post('/admin/categories', {
          name: catName,
          icon: catIcon,
          description: catDesc,
        });
        setMessage('Categoría creada exitosamente.');
      }
      setCatModalOpen(false);
      setEditingCat(null);
      setCatName('');
      setCatDesc('');
      fetchCategories();
      fetchStats();
    } catch (err: any) {
      alert(getErrorMessage(err));
    }
  };

  const handleDeleteCategory = async (id: number, name: string) => {
    if (!window.confirm(`¿Eliminar la categoría "${name}"?`)) return;
    try {
      await api.delete(`/admin/categories/${id}`);
      setMessage('Categoría eliminada.');
      fetchCategories();
      fetchStats();
    } catch (err: any) {
      alert(getErrorMessage(err));
    }
  };

  // CRUD Ciudades
  const handleSaveCity = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingCity) {
        await api.put(`/admin/cities/${editingCity.id}`, {
          name: cityName,
          department: cityDept,
        });
        setMessage('Ciudad actualizada exitosamente.');
      } else {
        await api.post('/admin/cities', {
          name: cityName,
          department: cityDept,
        });
        setMessage('Ciudad creada exitosamente.');
      }
      setCityModalOpen(false);
      setEditingCity(null);
      setCityName('');
      setCityDept('');
      fetchCities();
      fetchStats();
    } catch (err: any) {
      alert(getErrorMessage(err));
    }
  };

  const handleDeleteCity = async (id: number, name: string) => {
    if (!window.confirm(`¿Eliminar la ciudad "${name}"?`)) return;
    try {
      await api.delete(`/admin/cities/${id}`);
      setMessage('Ciudad eliminada.');
      fetchCities();
      fetchStats();
    } catch (err: any) {
      alert(getErrorMessage(err));
    }
  };

  const handleImport = async (e?: React.FormEvent, customTarget?: string) => {
    if (e) e.preventDefault();
    const target = customTarget || importPage;
    setImporting(true);
    setImportResult(null);
    try {
      const res = await api.post('/admin/import-paginas-amarillas', { page: target });
      setImportResult(res.data);
      setMessage(res.data.message || 'Directorio importado exitosamente');
      fetchStats();
      fetchBusinesses();
    } catch (err: any) {
      setImportResult({
        success: false,
        message: getErrorMessage(err),
      });
    } finally {
      setImporting(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Banner Admin Header */}
        <div className="bg-neutral-900 text-white rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border border-neutral-800 shadow-xl">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-amber-400 text-neutral-950 flex items-center justify-center font-bold shrink-0">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-amber-400 font-bold text-xs uppercase tracking-wider">
                  Panel de Control Administrativo
                </span>
                <span className="bg-purple-900/80 text-purple-200 text-[10px] font-bold px-2 py-0.5 rounded">
                  Super Admin
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-white mt-0.5">
                Páginas Amarillas Nicaragua
              </h1>
              <p className="text-xs text-neutral-400 mt-1">
                Aprobación de negocios, gestión de categorías, ciudades y auditoría de la plataforma.
              </p>
            </div>
          </div>
        </div>

        {/* Notificaciones */}
        {message && (
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center justify-between shadow-xs">
            <span>{message}</span>
            <button onClick={() => setMessage(null)} className="font-bold text-emerald-950">
              ✕
            </button>
          </div>
        )}

        {/* Métricas Generales */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-2xs">
            <span className="text-xs font-bold text-neutral-500 uppercase tracking-wider block mb-1">
              Pendientes de Revisión
            </span>
            <span className="text-3xl font-black text-amber-600">
              {stats?.businesses.pending ?? 0}
            </span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-2xs">
            <span className="text-xs font-bold text-neutral-500 uppercase tracking-wider block mb-1">
              Negocios Aprobados
            </span>
            <span className="text-3xl font-black text-emerald-600">
              {stats?.businesses.approved ?? 0}
            </span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-2xs">
            <span className="text-xs font-bold text-neutral-500 uppercase tracking-wider block mb-1">
              Total Negocios Registrados
            </span>
            <span className="text-3xl font-black text-neutral-900">
              {stats?.businesses.total ?? 0}
            </span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-2xs">
            <span className="text-xs font-bold text-neutral-500 uppercase tracking-wider block mb-1">
              Usuarios Registrados
            </span>
            <span className="text-3xl font-black text-purple-600">
              {stats?.users.total ?? 0}
            </span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-2xl border border-neutral-200 p-1.5 flex flex-wrap gap-1 shadow-2xs">
          <button
            onClick={() => setActiveTab('pending')}
            className={`flex-1 min-w-[150px] py-2.5 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
              activeTab === 'pending'
                ? 'bg-amber-400 text-neutral-950 shadow-xs'
                : 'text-neutral-600 hover:bg-neutral-100'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>Pendientes por Aprobar ({stats?.businesses.pending ?? 0})</span>
          </button>

          <button
            onClick={() => setActiveTab('all')}
            className={`flex-1 min-w-[150px] py-2.5 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
              activeTab === 'all'
                ? 'bg-neutral-900 text-white shadow-xs'
                : 'text-neutral-600 hover:bg-neutral-100'
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span>Todos los Negocios</span>
          </button>

          <button
            onClick={() => setActiveTab('categories')}
            className={`flex-1 min-w-[150px] py-2.5 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
              activeTab === 'categories'
                ? 'bg-neutral-900 text-white shadow-xs'
                : 'text-neutral-600 hover:bg-neutral-100'
            }`}
          >
            <Tag className="w-4 h-4" />
            <span>Categorías ({categories.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('cities')}
            className={`flex-1 min-w-[150px] py-2.5 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
              activeTab === 'cities'
                ? 'bg-neutral-900 text-white shadow-xs'
                : 'text-neutral-600 hover:bg-neutral-100'
            }`}
          >
            <MapPin className="w-4 h-4" />
            <span>Ciudades / Deptos ({cities.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('import')}
            className={`flex-1 min-w-[150px] py-2.5 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
              activeTab === 'import'
                ? 'bg-amber-400 text-neutral-950 shadow-xs'
                : 'text-neutral-600 hover:bg-neutral-100'
            }`}
          >
            <Download className="w-4 h-4" />
            <span>Importar Páginas Amarillas</span>
          </button>
        </div>

        {/* Tab 1: Negocios Pendientes */}
        {activeTab === 'pending' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-black text-neutral-900">
                Cola de Aprobación de Negocios
              </h2>
              <span className="text-xs text-neutral-500 font-medium">
                Revisa los datos antes de publicar en el portal
              </span>
            </div>

            {loading ? (
              <div className="py-12 text-center text-xs font-bold text-neutral-500">
                Cargando negocios pendientes...
              </div>
            ) : businesses.length > 0 ? (
              <div className="space-y-4">
                {businesses.map((b) => (
                  <div
                    key={b.id}
                    className="bg-white rounded-2xl border-2 border-amber-300 p-6 shadow-sm flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6"
                  >
                    <div className="flex items-start gap-4">
                      {/* Logo */}
                      <div className="w-16 h-16 rounded-xl bg-neutral-100 border border-neutral-200 overflow-hidden shrink-0 flex items-center justify-center">
                        {b.logo_url ? (
                          <img src={b.logo_url} alt={b.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-xl">
                            {b.name.charAt(0)}
                          </div>
                        )}
                      </div>

                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="text-base font-bold text-neutral-900">{b.name}</h3>
                          <span className="bg-amber-100 text-amber-900 text-[10px] font-bold px-2 py-0.5 rounded">
                            Pendiente
                          </span>
                        </div>
                        <p className="text-xs text-neutral-600 line-clamp-1">{b.short_description || b.address}</p>
                        <div className="flex items-center text-xs text-neutral-500 gap-3 flex-wrap">
                          <span>
                            <strong>Ciudad:</strong> {b.city?.name} ({b.city?.department})
                          </span>
                          <span>•</span>
                          <span>
                            <strong>Tel:</strong> {b.phone}
                          </span>
                          <span>•</span>
                          <span>
                            <strong>Dueño:</strong> {b.user?.name} ({b.user?.email})
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Acciones de aprobación */}
                    <div className="flex items-center gap-2 w-full lg:w-auto justify-end pt-3 lg:pt-0 border-t lg:border-t-0 border-neutral-100">
                      <Link
                        to={`/business/${b.slug}`}
                        className="p-2.5 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-700 text-xs font-bold"
                        title="Ver ficha completa"
                      >
                        <Eye className="w-4 h-4" />
                      </Link>

                      <button
                        onClick={() => handleUpdateStatus(b.id, 'approved')}
                        disabled={processingStatus}
                        className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2 rounded-xl text-xs transition-colors shadow-xs cursor-pointer"
                      >
                        <Check className="w-4 h-4" />
                        <span>Aprobar y Publicar</span>
                      </button>

                      <button
                        onClick={() => setRejectModalBiz(b)}
                        className="flex items-center gap-1.5 bg-red-100 hover:bg-red-200 text-red-700 font-bold px-3.5 py-2 rounded-xl text-xs transition-colors cursor-pointer"
                      >
                        <X className="w-4 h-4" />
                        <span>Rechazar</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-neutral-200 p-12 text-center">
                <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-2" />
                <h3 className="font-bold text-neutral-900 text-base">¡Excelente! Todo al día</h3>
                <p className="text-xs text-neutral-500">No hay negocios pendientes de revisión en este momento.</p>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Todos los Negocios */}
        {activeTab === 'all' && (
          <div className="space-y-4">
            {/* Filtros de Negocios */}
            <div className="bg-white p-4 rounded-2xl border border-neutral-200 flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2 w-full md:w-auto flex-wrap">
                <button
                  onClick={() => setStatusFilter('all')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                    statusFilter === 'all'
                      ? 'bg-neutral-900 text-white'
                      : 'bg-neutral-100 hover:bg-neutral-200 text-neutral-700'
                  }`}
                >
                  Todos
                </button>
                <button
                  onClick={() => setStatusFilter('approved')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                    statusFilter === 'approved'
                      ? 'bg-emerald-600 text-white'
                      : 'bg-neutral-100 hover:bg-neutral-200 text-neutral-700'
                  }`}
                >
                  Aprobados
                </button>
                <button
                  onClick={() => setStatusFilter('pending')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                    statusFilter === 'pending'
                      ? 'bg-amber-400 text-neutral-950 font-bold'
                      : 'bg-neutral-100 hover:bg-neutral-200 text-neutral-700'
                  }`}
                >
                  Pendientes
                </button>
                <button
                  onClick={() => setStatusFilter('rejected')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                    statusFilter === 'rejected'
                      ? 'bg-red-600 text-white'
                      : 'bg-neutral-100 hover:bg-neutral-200 text-neutral-700'
                  }`}
                >
                  Rechazados
                </button>
              </div>

              {/* Búsqueda rápida */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  fetchBusinesses();
                }}
                className="flex items-center gap-2 w-full md:w-72"
              >
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Buscar negocio..."
                    className="w-full pl-9 pr-3 py-1.5 bg-neutral-100 rounded-xl text-xs font-medium outline-none"
                  />
                </div>
                <button
                  type="submit"
                  className="bg-neutral-900 text-white px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer"
                >
                  Buscar
                </button>
              </form>
            </div>

            {/* Tabla de Negocios */}
            <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden shadow-2xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-neutral-700">
                  <thead className="bg-neutral-100 text-neutral-800 uppercase text-[10px] font-black tracking-wider">
                    <tr>
                      <th className="py-3 px-4">Negocio</th>
                      <th className="py-3 px-4">Ciudad</th>
                      <th className="py-3 px-4">Contacto</th>
                      <th className="py-3 px-4">Estado</th>
                      <th className="py-3 px-4">Destacado</th>
                      <th className="py-3 px-4 text-right">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100">
                    {businesses.map((b) => (
                      <tr key={b.id} className="hover:bg-neutral-50/80 transition-colors">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-lg bg-neutral-100 shrink-0 overflow-hidden flex items-center justify-center font-bold text-xs text-amber-700">
                              {b.logo_url ? (
                                <img src={b.logo_url} alt="" className="w-full h-full object-cover" />
                              ) : (
                                b.name.charAt(0)
                              )}
                            </div>
                            <div>
                              <p className="font-bold text-neutral-900 truncate max-w-xs">{b.name}</p>
                              <p className="text-[10px] text-neutral-500">Propietario: {b.user?.name}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4 whitespace-nowrap">
                          {b.city?.name}
                        </td>
                        <td className="py-3 px-4 whitespace-nowrap">
                          <p>{b.phone}</p>
                          {b.whatsapp && <p className="text-emerald-600 font-semibold">WA: {b.whatsapp}</p>}
                        </td>
                        <td className="py-3 px-4 whitespace-nowrap">
                          <span
                            className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full ${
                              b.status === 'approved'
                                ? 'bg-emerald-100 text-emerald-800'
                                : b.status === 'pending'
                                ? 'bg-amber-100 text-amber-900'
                                : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {b.status === 'approved'
                              ? 'Aprobado'
                              : b.status === 'pending'
                              ? 'Pendiente'
                              : 'Rechazado'}
                          </span>
                        </td>
                        <td className="py-3 px-4 whitespace-nowrap">
                          <button
                            onClick={() => handleToggleFeatured(b.id)}
                            className={`p-1.5 rounded-lg text-xs font-bold cursor-pointer transition-colors ${
                              b.featured
                                ? 'bg-amber-400 text-neutral-950 shadow-2xs'
                                : 'bg-neutral-100 text-neutral-400 hover:text-neutral-800'
                            }`}
                            title="Alternar destacado"
                          >
                            <Award className={`w-3.5 h-3.5 ${b.featured ? 'text-neutral-950' : ''}`} />
                          </button>
                        </td>
                        <td className="py-3 px-4 text-right whitespace-nowrap space-x-1.5">
                          <Link
                            to={`/business/${b.slug}`}
                            className="p-1.5 rounded-lg bg-neutral-100 hover:bg-neutral-200 text-neutral-700 inline-block"
                            title="Ver ficha"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </Link>
                          <Link
                            to={`/owner/edit-business/${b.id}`}
                            className="p-1.5 rounded-lg bg-neutral-100 hover:bg-neutral-200 text-neutral-700 inline-block"
                            title="Editar negocio"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </Link>
                          <button
                            onClick={() => handleDeleteBusiness(b.id, b.name)}
                            className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 inline-block cursor-pointer"
                            title="Eliminar"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Categorías */}
        {activeTab === 'categories' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-black text-neutral-900">Rubros y Categorías</h2>
                <p className="text-xs text-neutral-500">Clasificación de negocios en el directorio</p>
              </div>
              <button
                onClick={() => {
                  setEditingCat(null);
                  setCatName('');
                  setCatIcon('Briefcase');
                  setCatDesc('');
                  setCatModalOpen(true);
                }}
                className="flex items-center gap-1.5 bg-amber-400 hover:bg-amber-500 text-neutral-950 font-bold px-4 py-2 rounded-xl text-xs shadow-sm cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Nueva Categoría</span>
              </button>
            </div>

            <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden shadow-2xs">
              <table className="w-full text-left text-xs">
                <thead className="bg-neutral-100 text-neutral-800 uppercase text-[10px] font-black tracking-wider">
                  <tr>
                    <th className="py-3 px-4">Nombre</th>
                    <th className="py-3 px-4">Slug</th>
                    <th className="py-3 px-4">Icono Lucide</th>
                    <th className="py-3 px-4">Negocios Vinculados</th>
                    <th className="py-3 px-4 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {categories.map((cat) => (
                    <tr key={cat.id} className="hover:bg-neutral-50">
                      <td className="py-3 px-4 font-bold text-neutral-900">{cat.name}</td>
                      <td className="py-3 px-4 text-neutral-500">{cat.slug}</td>
                      <td className="py-3 px-4 font-mono text-neutral-600">{cat.icon}</td>
                      <td className="py-3 px-4">
                        <span className="bg-neutral-100 text-neutral-800 font-bold px-2 py-0.5 rounded-full text-[11px]">
                          {cat.businesses_count ?? 0}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right space-x-2">
                        <button
                          onClick={() => {
                            setEditingCat(cat);
                            setCatName(cat.name);
                            setCatIcon(cat.icon || 'Briefcase');
                            setCatDesc(cat.description || '');
                            setCatModalOpen(true);
                          }}
                          className="p-1.5 bg-neutral-100 hover:bg-neutral-200 rounded-lg text-neutral-700 cursor-pointer"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteCategory(cat.id, cat.name)}
                          className="p-1.5 bg-red-50 hover:bg-red-100 rounded-lg text-red-600 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 4: Ciudades */}
        {activeTab === 'cities' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-black text-neutral-900">Ciudades y Departamentos</h2>
                <p className="text-xs text-neutral-500">Ubicaciones territoriales de Nicaragua</p>
              </div>
              <button
                onClick={() => {
                  setEditingCity(null);
                  setCityName('');
                  setCityDept('');
                  setCityModalOpen(true);
                }}
                className="flex items-center gap-1.5 bg-amber-400 hover:bg-amber-500 text-neutral-950 font-bold px-4 py-2 rounded-xl text-xs shadow-sm cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Nueva Ciudad / Depto</span>
              </button>
            </div>

            <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden shadow-2xs">
              <table className="w-full text-left text-xs">
                <thead className="bg-neutral-100 text-neutral-800 uppercase text-[10px] font-black tracking-wider">
                  <tr>
                    <th className="py-3 px-4">Ciudad / Municipio</th>
                    <th className="py-3 px-4">Departamento</th>
                    <th className="py-3 px-4">Slug</th>
                    <th className="py-3 px-4">Negocios Registrados</th>
                    <th className="py-3 px-4 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {cities.map((city) => (
                    <tr key={city.id} className="hover:bg-neutral-50">
                      <td className="py-3 px-4 font-bold text-neutral-900">{city.name}</td>
                      <td className="py-3 px-4 text-neutral-700 font-semibold">{city.department}</td>
                      <td className="py-3 px-4 text-neutral-500 font-mono">{city.slug}</td>
                      <td className="py-3 px-4">
                        <span className="bg-neutral-100 text-neutral-800 font-bold px-2 py-0.5 rounded-full text-[11px]">
                          {city.businesses_count ?? 0}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right space-x-2">
                        <button
                          onClick={() => {
                            setEditingCity(city);
                            setCityName(city.name);
                            setCityDept(city.department);
                            setCityModalOpen(true);
                          }}
                          className="p-1.5 bg-neutral-100 hover:bg-neutral-200 rounded-lg text-neutral-700 cursor-pointer"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteCity(city.id, city.name)}
                          className="p-1.5 bg-red-50 hover:bg-red-100 rounded-lg text-red-600 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 5: Importador Páginas Amarillas */}
        {activeTab === 'import' && (
          <div className="space-y-6">
            <div className="bg-white border border-neutral-200 rounded-3xl p-6 sm:p-8 shadow-2xs">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="space-y-2">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-neutral-900 text-amber-400 text-xs font-black uppercase tracking-wider">
                    <Download className="w-3.5 h-3.5" />
                    Sincronización de Directorio
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black text-neutral-900">
                    Importar Contactos de Páginas Amarillas Nicaragua 2025
                  </h2>
                  <p className="text-xs sm:text-sm text-neutral-600 max-w-2xl">
                    Importa negocios, teléfonos de contacto, direcciones y números celulares organizados por rubro comercial y departamento de Nicaragua.
                  </p>
                </div>
                <a
                  href={`https://www.paginasamarillas.com.ni/directorios/nicaragua/nicaragua2025/${importPage}/`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-neutral-100 border border-neutral-300 text-neutral-800 text-xs font-bold hover:bg-neutral-200 shadow-2xs shrink-0"
                >
                  <Globe className="w-4 h-4 text-neutral-700" />
                  <span>Ver Página {importPage} en Vivo</span>
                </a>
              </div>
            </div>

            <div className="bg-white rounded-3xl border border-neutral-200 p-6 sm:p-8 shadow-2xs space-y-6">
              {/* Opción 1: Todo el Directorio */}
              <div className="p-5 rounded-2xl bg-amber-50 border border-amber-300 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div>
                  <span className="text-amber-900 font-black text-xs uppercase tracking-wider block mb-1">
                    Carga Masiva Completa
                  </span>
                  <h3 className="text-base font-bold text-neutral-900">
                    Sincronizar todo el catálogo de Páginas Amarillas 2025 (Páginas 19 a 132)
                  </h3>
                  <p className="text-xs text-neutral-600 mt-0.5">
                    Descarga y procesa automáticamente todos los contactos comerciales de Nicaragua de la A a la Z.
                  </p>
                </div>
                <button
                  type="button"
                  disabled={importing}
                  onClick={() => handleImport(undefined, 'all')}
                  className="px-6 py-3 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-amber-400 font-black text-xs shrink-0 flex items-center gap-2 cursor-pointer disabled:opacity-50 shadow-sm"
                >
                  <Download className="w-4 h-4" />
                  <span>Sincronizar Directorio Completo</span>
                </button>
              </div>

              <div className="border-t border-neutral-200 pt-6">
                <form onSubmit={handleImport} className="space-y-5">
                  <div>
                    <label className="block text-xs font-bold text-neutral-800 uppercase tracking-wider mb-2">
                      O importar una página individual (1 a 134)
                    </label>
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                      <input
                        type="number"
                        min={1}
                        max={134}
                        required
                        value={importPage}
                        onChange={(e) => setImportPage(e.target.value)}
                        placeholder="Ej. 20"
                        className="w-full sm:w-48 px-4 py-3 rounded-xl border border-neutral-300 text-base font-bold text-neutral-900 focus:ring-2 focus:ring-amber-400 focus:outline-none"
                      />
                      <button
                        type="submit"
                        disabled={importing}
                        className="px-6 py-3 rounded-xl bg-amber-400 hover:bg-amber-500 text-neutral-950 font-black text-sm flex items-center justify-center gap-2 transition-all shadow-xs cursor-pointer disabled:opacity-50"
                      >
                        {importing ? (
                          <>
                            <div className="w-4 h-4 border-2 border-neutral-950 border-t-transparent rounded-full animate-spin" />
                            <span>Sincronizando contactos...</span>
                          </>
                        ) : (
                          <>
                            <Download className="w-4 h-4" />
                            <span>Importar Esta Página</span>
                          </>
                        )}
                      </button>
                    </div>
                    <span className="text-[11px] text-neutral-500 block mt-1.5">
                      Ejemplo: La página <strong>20</strong> contiene 123 negocios reales de Managua, Matagalpa, León y más.
                    </span>
                  </div>

                  {/* Accesos rápidos a páginas */}
                  <div>
                    <span className="text-xs font-bold text-neutral-700 block mb-2">Páginas de acceso rápido:</span>
                    <div className="flex flex-wrap gap-2">
                      {['19', '20', '21', '22', '23', '24', '25'].map((pg) => (
                        <button
                          key={pg}
                          type="button"
                          onClick={() => setImportPage(pg)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                            importPage === pg
                              ? 'bg-neutral-950 text-white'
                              : 'bg-neutral-100 hover:bg-neutral-200 text-neutral-800'
                          }`}
                        >
                          Página {pg}
                        </button>
                      ))}
                    </div>
                  </div>
                </form>
              </div>

              {/* Resultado de importación */}
              {importResult && (
                <div
                  className={`p-5 rounded-2xl border text-xs font-medium space-y-2 ${
                    importResult.success
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                      : 'bg-red-50 border-red-200 text-red-900'
                  }`}
                >
                  <div className="flex items-center gap-2 font-bold text-sm">
                    {importResult.success ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    ) : (
                      <X className="w-5 h-5 text-red-600" />
                    )}
                    <span>{importResult.message}</span>
                  </div>
                  {importResult.output && (
                    <pre className="font-mono text-[11px] bg-white/70 p-3 rounded-xl overflow-x-auto whitespace-pre-wrap border border-neutral-200">
                      {importResult.output}
                    </pre>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Modal Rechazar Negocio */}
      {rejectModalBiz && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-bold text-base text-neutral-900">
                Rechazar Negocio: {rejectModalBiz.name}
              </h3>
              <button onClick={() => setRejectModalBiz(null)} className="text-neutral-400 hover:text-neutral-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-xs text-neutral-600">
              Ingresa el motivo del rechazo para que el propietario pueda corregir o aportar la documentación requerida:
            </p>
            <textarea
              rows={3}
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="Ej. La dirección física está incompleta, o falta adjuntar número de teléfono válido..."
              className="w-full p-3 rounded-xl border border-neutral-300 text-xs font-medium outline-none focus:border-red-500"
            />
            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setRejectModalBiz(null)}
                className="flex-1 py-2 rounded-xl border border-neutral-300 text-neutral-700 font-bold text-xs"
              >
                Cancelar
              </button>
              <button
                onClick={() => handleUpdateStatus(rejectModalBiz.id, 'rejected', rejectReason)}
                disabled={processingStatus}
                className="flex-1 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs disabled:opacity-50"
              >
                Confirmar Rechazo
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Categoría */}
      {catModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-900/60 backdrop-blur-xs p-4">
          <form
            onSubmit={handleSaveCategory}
            className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4"
          >
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-bold text-base text-neutral-900">
                {editingCat ? 'Editar Categoría' : 'Nueva Categoría'}
              </h3>
              <button type="button" onClick={() => setCatModalOpen(false)}>
                <X className="w-5 h-5 text-neutral-400" />
              </button>
            </div>
            <div>
              <label className="block text-xs font-bold text-neutral-800 mb-1">Nombre</label>
              <input
                type="text"
                required
                value={catName}
                onChange={(e) => setCatName(e.target.value)}
                placeholder="Ej. Veterinarias y Mascotas"
                className="w-full px-3 py-2 rounded-xl border border-neutral-300 text-xs font-medium outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-neutral-800 mb-1">Icono Lucide</label>
              <input
                type="text"
                value={catIcon}
                onChange={(e) => setCatIcon(e.target.value)}
                placeholder="Ej. Utensils, HeartPulse, Hammer, Car, Store"
                className="w-full px-3 py-2 rounded-xl border border-neutral-300 text-xs font-medium outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-neutral-800 mb-1">Descripción</label>
              <textarea
                rows={2}
                value={catDesc}
                onChange={(e) => setCatDesc(e.target.value)}
                placeholder="Breve resumen del rubro..."
                className="w-full px-3 py-2 rounded-xl border border-neutral-300 text-xs font-medium outline-none"
              />
            </div>
            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setCatModalOpen(false)}
                className="flex-1 py-2 rounded-xl border border-neutral-300 text-neutral-700 font-bold text-xs"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="flex-1 py-2 rounded-xl bg-amber-400 hover:bg-amber-500 text-neutral-950 font-bold text-xs"
              >
                Guardar Categoría
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Modal Ciudad */}
      {cityModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-900/60 backdrop-blur-xs p-4">
          <form
            onSubmit={handleSaveCity}
            className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4"
          >
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-bold text-base text-neutral-900">
                {editingCity ? 'Editar Ciudad' : 'Nueva Ciudad / Municipio'}
              </h3>
              <button type="button" onClick={() => setCityModalOpen(false)}>
                <X className="w-5 h-5 text-neutral-400" />
              </button>
            </div>
            <div>
              <label className="block text-xs font-bold text-neutral-800 mb-1">
                Nombre de la Ciudad o Municipio
              </label>
              <input
                type="text"
                required
                value={cityName}
                onChange={(e) => setCityName(e.target.value)}
                placeholder="Ej. Tipitapa"
                className="w-full px-3 py-2 rounded-xl border border-neutral-300 text-xs font-medium outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-neutral-800 mb-1">
                Departamento
              </label>
              <input
                type="text"
                required
                value={cityDept}
                onChange={(e) => setCityDept(e.target.value)}
                placeholder="Ej. Managua"
                className="w-full px-3 py-2 rounded-xl border border-neutral-300 text-xs font-medium outline-none"
              />
            </div>
            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setCityModalOpen(false)}
                className="flex-1 py-2 rounded-xl border border-neutral-300 text-neutral-700 font-bold text-xs"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="flex-1 py-2 rounded-xl bg-amber-400 hover:bg-amber-500 text-neutral-950 font-bold text-xs"
              >
                Guardar Ciudad
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
