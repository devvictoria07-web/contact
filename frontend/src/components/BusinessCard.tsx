import React from 'react';
import { Link } from 'react-router-dom';
import {
  Phone,
  MessageCircle,
  MapPin,
  Clock,
  Award,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react';
import type { Business } from '../types';

interface BusinessCardProps {
  business: Business;
}

export const BusinessCard: React.FC<BusinessCardProps> = ({ business }) => {
  // Limpiar número de WhatsApp para enlace
  const cleanWhatsapp = business.whatsapp?.replace(/[^0-9]/g, '') || '';
  const cleanPhone = business.phone?.replace(/[^0-9+]/g, '') || '';

  return (
    <div className="bg-white rounded-2xl border border-neutral-200/90 shadow-sm hover:shadow-xl transition-all duration-200 flex flex-col justify-between overflow-hidden group hover:border-amber-400">
      {/* Top Banner & Badges */}
      <div className="p-5">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-3">
            {/* Business Logo */}
            <div className="w-16 h-16 rounded-xl bg-neutral-100 border border-neutral-200 overflow-hidden shrink-0 flex items-center justify-center p-0.5 shadow-inner">
              {business.logo_url ? (
                <img
                  src={business.logo_url}
                  alt={business.name}
                  className="w-full h-full object-cover rounded-lg group-hover:scale-105 transition-transform"
                  onError={(e) => {
                    // Fallback to placeholder icon
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
              ) : (
                <div className="w-full h-full bg-amber-100 text-amber-700 flex items-center justify-center font-black text-xl rounded-lg">
                  {business.name.charAt(0)}
                </div>
              )}
            </div>

            {/* Title & verification */}
            <div>
              <div className="flex items-center gap-1.5 flex-wrap">
                <Link
                  to={`/business/${business.slug}`}
                  className="font-bold text-base sm:text-lg text-neutral-900 hover:text-amber-600 transition-colors line-clamp-1"
                >
                  {business.name}
                </Link>
                {business.status === 'approved' && (
                  <span title="Verificado por Páginas Amarillas">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  </span>
                )}
              </div>

              {/* City & Department */}
              <div className="flex items-center text-xs font-semibold text-neutral-500 mt-1">
                <MapPin className="w-3.5 h-3.5 mr-1 text-amber-500 shrink-0" />
                <span>
                  {business.city?.name}, {business.city?.department}
                </span>
              </div>
            </div>
          </div>

          {/* Featured pill */}
          {business.featured && (
            <span className="inline-flex items-center gap-1 bg-amber-400 text-neutral-950 text-[10px] font-black uppercase px-2 py-0.5 rounded-md shadow-xs shrink-0">
              <Award className="w-3 h-3" />
              Destacado
            </span>
          )}
        </div>

        {/* Categories Pills */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          {business.categories?.map((cat) => (
            <span
              key={cat.id}
              className="text-[11px] font-semibold bg-neutral-100 hover:bg-neutral-200 text-neutral-700 px-2 py-0.5 rounded-md transition-colors"
            >
              {cat.name}
            </span>
          ))}
        </div>

        {/* Short Description */}
        <p className="text-xs text-neutral-600 line-clamp-2 leading-relaxed mb-4">
          {business.short_description || business.description || 'Contacto comercial verificado en el directorio nacional de Nicaragua.'}
        </p>

        {/* Key Info Details */}
        <div className="space-y-1.5 text-xs text-neutral-600 border-t border-neutral-100 pt-3">
          <div className="flex items-start gap-2">
            <span className="font-bold text-neutral-800 shrink-0">Dirección:</span>
            <span className="line-clamp-1 text-neutral-600">{business.address}</span>
          </div>

          {business.opening_hours && (
            <div className="flex items-center gap-1.5 text-neutral-500">
              <Clock className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
              <span className="truncate">{business.opening_hours}</span>
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons Footer */}
      <div className="bg-neutral-50 px-5 py-3 border-t border-neutral-100 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          {/* Teléfono directo */}
          <a
            href={`tel:${cleanPhone}`}
            className="flex items-center gap-1.5 bg-neutral-900 hover:bg-neutral-800 text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-colors"
            title="Llamar directamente"
          >
            <Phone className="w-3.5 h-3.5 text-amber-400" />
            <span>Llamar</span>
          </a>

          {/* WhatsApp directo */}
          {cleanWhatsapp && (
            <a
              href={`https://wa.me/${cleanWhatsapp}?text=Hola%20${encodeURIComponent(
                business.name
              )},%20te%20contacto%20desde%20Páginas%20Amarillas%20Nicaragua.`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-colors"
              title="Escribir por WhatsApp"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>WhatsApp</span>
            </a>
          )}
        </div>

        {/* Ver detalle */}
        <Link
          to={`/business/${business.slug}`}
          className="text-xs font-black text-amber-600 hover:text-amber-700 flex items-center gap-1 py-1.5 px-2 hover:bg-amber-100/60 rounded-lg transition-colors"
        >
          <span>Ver Ficha</span>
          <ExternalLink className="w-3 h-3" />
        </Link>
      </div>
    </div>
  );
};
