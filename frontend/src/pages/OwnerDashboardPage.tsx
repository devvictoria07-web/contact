import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api, getErrorMessage } from '../services/api';
import type { Business } from '../types';
import {
  Building2,
  PlusCircle,
  Edit,
  Trash2,
  Eye,
  CheckCircle2,
  Clock,
  AlertTriangle,
  MapPin,
  Phone,
} from 'lucide-react';

export const OwnerDashboardPage: React.FC = () => {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const fetchBusinesses = async () => {
    setLoading(true);
    try {
      const res = await api.get('/owner/businesses');
      setBusinesses(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBusinesses();
  }, []);

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      setDeleting(true);
      await api.delete(`/owner/businesses/${deleteId}`);
      setMessage('Negocio eliminado exitosamente.');
      setDeleteId(null);
      fetchBusinesses();
    } catch (err: any) {
      alert(getErrorMessage(err));
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 py-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Cabecera del Panel */}
        <div className="bg-white rounded-3xl border border-neutral-200 shadow-sm p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
              <span className="text-xs font-bold uppercase tracking-wider text-neutral-500">
                Panel del Propietario
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-neutral-900 mt-1">
              Mis Negocios Registrados
            </h1>
            <p className="text-xs text-neutral-600 mt-1">
              Gestiona, actualiza y consulta el estado de aprobación de tus fichas comerciales en Nicaragua.
            </p>
          </div>

          <Link
            to="/register-business"
            className="inline-flex items-center space-x-2 bg-amber-400 hover:bg-amber-500 text-neutral-950 font-black px-5 py-3 rounded-xl text-xs shadow-md transition-all shrink-0 cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Publicar Otro Negocio</span>
          </Link>
        </div>

        {message && (
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center justify-between">
            <span>{message}</span>
            <button onClick={() => setMessage(null)} className="text-emerald-950 font-bold">
              ✕
            </button>
          </div>
        )}

        {/* Resumen de Estado */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-2xs">
            <span className="text-xs font-bold text-neutral-500 uppercase tracking-wider block mb-1">
              Publicados & Aprobados
            </span>
            <span className="text-2xl font-black text-emerald-600">
              {businesses.filter((b) => b.status === 'approved').length}
            </span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-2xs">
            <span className="text-xs font-bold text-neutral-500 uppercase tracking-wider block mb-1">
              En Revisión Administrativa
            </span>
            <span className="text-2xl font-black text-amber-600">
              {businesses.filter((b) => b.status === 'pending').length}
            </span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-2xs">
            <span className="text-xs font-bold text-neutral-500 uppercase tracking-wider block mb-1">
              Requieren Corrección
            </span>
            <span className="text-2xl font-black text-red-600">
              {businesses.filter((b) => b.status === 'rejected').length}
            </span>
          </div>
        </div>

        {/* Listado de Negocios */}
        {loading ? (
          <div className="py-16 text-center">
            <div className="w-8 h-8 border-4 border-amber-400 border-t-neutral-900 rounded-full animate-spin mx-auto mb-3"></div>
            <p className="text-xs font-bold text-neutral-500">Cargando tus negocios...</p>
          </div>
        ) : businesses.length > 0 ? (
          <div className="space-y-4">
            {businesses.map((business) => (
              <div
                key={business.id}
                className="bg-white rounded-2xl border border-neutral-200 p-5 sm:p-6 shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
              >
                <div className="flex items-start gap-4">
                  {/* Logo */}
                  <div className="w-16 h-16 rounded-xl bg-neutral-100 border border-neutral-200 overflow-hidden shrink-0 flex items-center justify-center p-0.5 shadow-inner">
                    {business.logo_url ? (
                      <img
                        src={business.logo_url}
                        alt={business.name}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    ) : (
                      <div className="w-full h-full bg-amber-100 text-amber-700 flex items-center justify-center font-black text-xl rounded-lg">
                        {business.name.charAt(0)}
                      </div>
                    )}
                  </div>

                  {/* Informacion */}
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-bold text-base sm:text-lg text-neutral-900">
                        {business.name}
                      </h3>

                      {/* Status Badge */}
                      {business.status === 'approved' && (
                        <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-800 text-[11px] font-bold px-2.5 py-0.5 rounded-full">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Aprobado y Publicado
                        </span>
                      )}
                      {business.status === 'pending' && (
                        <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-900 text-[11px] font-bold px-2.5 py-0.5 rounded-full">
                          <Clock className="w-3.5 h-3.5" />
                          Pendiente de Aprobación
                        </span>
                      )}
                      {business.status === 'rejected' && (
                        <span className="inline-flex items-center gap-1 bg-red-100 text-red-900 text-[11px] font-bold px-2.5 py-0.5 rounded-full">
                          <AlertTriangle className="w-3.5 h-3.5" />
                          Rechazado
                        </span>
                      )}
                    </div>

                    <div className="flex items-center text-xs text-neutral-500 gap-3 flex-wrap">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-amber-500" />
                        {business.city?.name}, {business.city?.department}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Phone className="w-3.5 h-3.5 text-neutral-400" />
                        {business.phone}
                      </span>
                    </div>

                    {/* Notas de rechazo si aplica */}
                    {business.status === 'rejected' && business.admin_notes && (
                      <div className="text-xs text-red-700 bg-red-50 p-2.5 rounded-xl border border-red-200 mt-2">
                        <strong>Motivo del Administrador:</strong> {business.admin_notes}
                      </div>
                    )}
                  </div>
                </div>

                {/* Acciones */}
                <div className="flex items-center gap-2 w-full md:w-auto justify-end pt-3 md:pt-0 border-t md:border-t-0 border-neutral-100">
                  {business.status === 'approved' && (
                    <Link
                      to={`/business/${business.slug}`}
                      className="p-2.5 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-700 transition-colors"
                      title="Ver ficha pública"
                    >
                      <Eye className="w-4 h-4" />
                    </Link>
                  )}

                  <Link
                    to={`/owner/edit-business/${business.id}`}
                    className="flex items-center gap-1 bg-neutral-900 hover:bg-neutral-800 text-amber-400 font-bold px-3.5 py-2 rounded-xl text-xs transition-colors"
                    title="Editar información"
                  >
                    <Edit className="w-3.5 h-3.5" />
                    <span>Editar</span>
                  </Link>

                  <button
                    onClick={() => setDeleteId(business.id)}
                    className="p-2.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 transition-colors cursor-pointer"
                    title="Eliminar negocio"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-neutral-200 p-12 text-center shadow-2xs">
            <div className="w-16 h-16 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mx-auto mb-4">
              <Building2 className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-bold text-neutral-900 mb-1">
              Aún no tienes negocios registrados
            </h2>
            <p className="text-xs text-neutral-500 max-w-sm mx-auto mb-6">
              Empieza ahora publicando tu primer establecimiento comercial para aparecer en las Páginas Amarillas de Nicaragua.
            </p>
            <Link
              to="/register-business"
              className="inline-flex items-center space-x-2 bg-amber-400 hover:bg-amber-500 text-neutral-950 font-bold px-5 py-3 rounded-xl text-xs transition-colors shadow-sm"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Registrar Mi Primer Negocio</span>
            </Link>
          </div>
        )}
      </div>

      {/* Modal Confirmación de Eliminación */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-xl space-y-4">
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <div className="text-center">
              <h3 className="text-base font-bold text-neutral-900">¿Eliminar este negocio?</h3>
              <p className="text-xs text-neutral-500 mt-1">
                Esta acción es irreversible y retirará el negocio de forma permanente de las Páginas Amarillas.
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setDeleteId(null)}
                className="flex-1 py-2 text-xs font-bold rounded-xl border border-neutral-300 text-neutral-700 hover:bg-neutral-50 cursor-pointer"
              >
                Cancelar
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="flex-1 py-2 text-xs font-bold rounded-xl bg-red-600 text-white hover:bg-red-700 disabled:opacity-50 cursor-pointer"
              >
                {deleting ? 'Eliminando...' : 'Sí, Eliminar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
