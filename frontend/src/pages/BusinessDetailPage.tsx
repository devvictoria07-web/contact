import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import type { Business } from '../types';
import { BusinessCard } from '../components/BusinessCard';
import {
  Phone,
  MessageCircle,
  Mail,
  Globe,
  MapPin,
  Clock,
  ArrowLeft,
  CheckCircle2,
  AlertTriangle,
  Share2,
  ExternalLink,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const BusinessDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { user, isAdmin } = useAuth();

  const [business, setBusiness] = useState<Business | null>(null);
  const [related, setRelated] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchBusiness = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await api.get(`/businesses/${slug}`);
        setBusiness(res.data.business);
        setRelated(res.data.related || []);
      } catch (err: any) {
        setError(
          err.response?.data?.message || 'No se pudo cargar la información del negocio.'
        );
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchBusiness();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [slug]);

  const cleanWhatsapp = business?.whatsapp?.replace(/[^0-9]/g, '') || '';
  const cleanPhone = business?.phone?.replace(/[^0-9+]/g, '') || '';

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-50 py-12 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-amber-400 border-t-neutral-900 rounded-full animate-spin"></div>
          <p className="text-xs font-bold text-neutral-600">Cargando datos del negocio...</p>
        </div>
      </div>
    );
  }

  if (error || !business) {
    return (
      <div className="min-h-screen bg-neutral-50 py-16 px-4">
        <div className="max-w-md mx-auto bg-white p-8 rounded-2xl border border-neutral-200 text-center shadow-sm">
          <div className="w-14 h-14 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="w-7 h-7" />
          </div>
          <h2 className="text-xl font-bold text-neutral-900 mb-2">Negocio no encontrado</h2>
          <p className="text-xs text-neutral-500 mb-6">{error || 'El contacto que buscas no existe o fue retirado.'}</p>
          <Link
            to="/directory"
            className="inline-flex items-center space-x-2 bg-amber-400 hover:bg-amber-500 text-neutral-950 font-bold px-4 py-2.5 rounded-xl text-xs transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Volver al Directorio</span>
          </Link>
        </div>
      </div>
    );
  }

  const isOwner = user?.id === business.user_id;

  return (
    <div className="min-h-screen bg-neutral-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Breadcrumb & Navigation */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center space-x-1.5 text-xs font-bold text-neutral-600 hover:text-amber-600 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Regresar</span>
          </button>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleShare}
              className="inline-flex items-center space-x-1 bg-white hover:bg-neutral-100 border border-neutral-300 text-neutral-700 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>{copied ? '¡Enlace copiado!' : 'Compartir'}</span>
            </button>

            {(isOwner || isAdmin) && (
              <Link
                to={`/owner/edit-business/${business.id}`}
                className="bg-neutral-900 hover:bg-neutral-800 text-amber-400 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors"
              >
                Editar Negocio
              </Link>
            )}
          </div>
        </div>

        {/* Status Warning Banner (if pending or rejected) */}
        {business.status !== 'approved' && (
          <div
            className={`p-4 rounded-xl border flex items-start gap-3 ${
              business.status === 'pending'
                ? 'bg-amber-50 border-amber-300 text-amber-900'
                : 'bg-red-50 border-red-300 text-red-900'
            }`}
          >
            <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-sm">
                {business.status === 'pending'
                  ? 'Negocio pendiente de aprobación'
                  : 'Negocio rechazado por el administrador'}
              </p>
              <p className="text-xs mt-0.5 opacity-90">
                {business.status === 'pending'
                  ? 'Este perfil aún no es visible públicamente en el catálogo. Un administrador lo revisará pronto.'
                  : `Motivo: ${business.admin_notes || 'Información incompleta o no verificable.'}`}
              </p>
            </div>
          </div>
        )}

        {/* Main Profile Header */}
        <div className="bg-white rounded-3xl border border-neutral-200 shadow-sm p-6 sm:p-8">
          <div className="flex flex-col md:flex-row gap-6 items-start">
            {/* Logo */}
            <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-2xl bg-neutral-100 border-2 border-neutral-200 overflow-hidden shrink-0 flex items-center justify-center p-1 shadow-inner">
              {business.logo_url ? (
                <img
                  src={business.logo_url}
                  alt={business.name}
                  className="w-full h-full object-cover rounded-xl"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
              ) : (
                <div className="w-full h-full bg-amber-200 text-amber-800 flex items-center justify-center font-black text-3xl rounded-xl">
                  {business.name.charAt(0)}
                </div>
              )}
            </div>

            {/* Profile Summary */}
            <div className="flex-1 space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-black text-neutral-900 tracking-tight">
                  {business.name}
                </h1>
                {business.status === 'approved' && (
                  <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-800 text-xs font-bold px-2.5 py-0.5 rounded-full">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    Verificado
                  </span>
                )}
                {business.featured && (
                  <span className="bg-amber-400 text-neutral-950 text-xs font-black px-2.5 py-0.5 rounded-full">
                    Destacado
                  </span>
                )}
              </div>

              {/* Categories */}
              <div className="flex flex-wrap gap-1.5">
                {business.categories?.map((cat) => (
                  <Link
                    key={cat.id}
                    to={`/directory?category=${cat.slug}`}
                    className="text-xs font-bold bg-neutral-100 hover:bg-neutral-200 text-neutral-800 px-3 py-1 rounded-lg transition-colors"
                  >
                    {cat.name}
                  </Link>
                ))}
              </div>

              {/* Location */}
              <div className="flex items-center text-sm font-semibold text-neutral-600">
                <MapPin className="w-4 h-4 text-amber-500 mr-1.5 shrink-0" />
                <span>
                  {business.city?.name}, Departamento de {business.city?.department}, Nicaragua
                </span>
              </div>

              {/* Short tagline */}
              {business.short_description && (
                <p className="text-sm text-neutral-600 italic">
                  "{business.short_description}"
                </p>
              )}
            </div>
          </div>

          {/* Action CTAs: Call, WhatsApp, Email, Website */}
          <div className="mt-8 pt-6 border-t border-neutral-100 grid grid-cols-2 sm:grid-cols-4 gap-3">
            <a
              href={`tel:${cleanPhone}`}
              className="flex items-center justify-center space-x-2 bg-neutral-900 hover:bg-neutral-800 text-white font-bold py-3 px-4 rounded-xl text-xs sm:text-sm transition-all shadow-sm"
            >
              <Phone className="w-4 h-4 text-amber-400" />
              <span>{business.phone}</span>
            </a>

            {cleanWhatsapp ? (
              <a
                href={`https://wa.me/${cleanWhatsapp}?text=Hola%20${encodeURIComponent(
                  business.name
                )},%20te%20contacto%20desde%20Páginas%20Amarillas%20Nicaragua.`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center space-x-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-4 rounded-xl text-xs sm:text-sm transition-all shadow-sm"
              >
                <MessageCircle className="w-4 h-4" />
                <span>WhatsApp</span>
              </a>
            ) : (
              <div className="flex items-center justify-center bg-neutral-100 text-neutral-400 font-medium py-3 px-4 rounded-xl text-xs">
                Sin WhatsApp
              </div>
            )}

            {business.email ? (
              <a
                href={`mailto:${business.email}`}
                className="flex items-center justify-center space-x-2 bg-white hover:bg-neutral-50 text-neutral-800 font-bold py-3 px-4 rounded-xl text-xs sm:text-sm border border-neutral-300 transition-all"
              >
                <Mail className="w-4 h-4 text-neutral-600" />
                <span>Enviar Correo</span>
              </a>
            ) : (
              <div className="flex items-center justify-center bg-neutral-100 text-neutral-400 font-medium py-3 px-4 rounded-xl text-xs">
                Sin Correo
              </div>
            )}

            {business.website ? (
              <a
                href={business.website}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center space-x-2 bg-amber-400 hover:bg-amber-500 text-neutral-950 font-bold py-3 px-4 rounded-xl text-xs sm:text-sm transition-all shadow-sm"
              >
                <Globe className="w-4 h-4" />
                <span>Sitio Web</span>
              </a>
            ) : (
              <div className="flex items-center justify-center bg-neutral-100 text-neutral-400 font-medium py-3 px-4 rounded-xl text-xs">
                Sin Sitio Web
              </div>
            )}
          </div>
        </div>

        {/* Two-column layout: Details & Contact Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Full Description and About */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-neutral-200 shadow-sm space-y-4">
              <h2 className="text-lg font-black text-neutral-900 border-b border-neutral-100 pb-3 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded bg-amber-400"></span>
                Descripción Comercial & Servicios
              </h2>
              <div className="text-sm text-neutral-700 leading-relaxed whitespace-pre-line">
                {business.description ||
                  'Este negocio no ha añadido una descripción detallada todavía. Para consultar productos, servicios o cotizaciones especiales, comunícate directamente por teléfono o WhatsApp.'}
              </div>
            </div>

            {/* Social Media Links */}
            {(business.facebook || business.instagram) && (
              <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm">
                <h3 className="text-sm font-bold text-neutral-900 mb-4">
                  Redes Sociales Oficiales
                </h3>
                <div className="flex flex-wrap gap-3">
                  {business.facebook && (
                    <a
                      href={business.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-xs font-bold transition-colors"
                    >
                      <span className="font-black text-sm">f</span>
                      <span>Facebook</span>
                      <ExternalLink className="w-3 h-3 ml-1" />
                    </a>
                  )}
                  {business.instagram && (
                    <a
                      href={business.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:opacity-90 text-white px-4 py-2 rounded-xl text-xs font-bold transition-opacity"
                    >
                      <span className="font-black text-sm">IG</span>
                      <span>Instagram</span>
                      <ExternalLink className="w-3 h-3 ml-1" />
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Physical Location & Hours */}
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm space-y-4">
              <h3 className="text-sm font-black text-neutral-900 uppercase tracking-wider flex items-center gap-2">
                <MapPin className="w-4 h-4 text-amber-500" />
                Dirección Física
              </h3>
              <p className="text-xs text-neutral-700 leading-relaxed font-medium bg-neutral-50 p-3 rounded-xl border border-neutral-200">
                {business.address}
              </p>

              {/* Horarios */}
              <div className="pt-2 border-t border-neutral-100">
                <h4 className="text-xs font-bold text-neutral-900 uppercase tracking-wider mb-2 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-amber-500" />
                  Horario de Atención
                </h4>
                <p className="text-xs text-neutral-600 font-medium">
                  {business.opening_hours || 'Horario no especificado. Consulta por teléfono.'}
                </p>
              </div>

              {/* Información adicional */}
              <div className="pt-2 border-t border-neutral-100 text-[11px] text-neutral-400 space-y-1">
                <p>Publicado en Páginas Amarillas Nicaragua</p>
                <p>Código de Ficha: #{business.id}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Related Businesses */}
        {related.length > 0 && (
          <div className="pt-8 border-t border-neutral-200">
            <h2 className="text-xl font-black text-neutral-900 mb-6">
              Otros Negocios en el Mismo Rubro o Zona
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {related.map((b) => (
                <BusinessCard key={b.id} business={b} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
