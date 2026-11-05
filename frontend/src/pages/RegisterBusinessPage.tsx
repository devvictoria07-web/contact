import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api, getErrorMessage } from '../services/api';
import type { Category, City } from '../types';
import {
  Upload,
  Building2,
  Phone,
  CheckCircle,
  AlertCircle,
  Info,
  X,
} from 'lucide-react';

export const RegisterBusinessPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [cities, setCities] = useState<City[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  // Form states
  const [name, setName] = useState('');
  const [cityId, setCityId] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
  const [shortDescription, setShortDescription] = useState('');
  const [description, setDescription] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [email, setEmail] = useState('');
  const [website, setWebsite] = useState('');
  const [openingHours, setOpeningHours] = useState('');
  const [facebook, setFacebook] = useState('');
  const [instagram, setInstagram] = useState('');

  // Logo file state & live preview
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  // Status & errors
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    const loadFormData = async () => {
      try {
        const [cityRes, catRes] = await Promise.all([
          api.get('/cities'),
          api.get('/categories'),
        ]);
        setCities(cityRes.data);
        setCategories(catRes.data);
      } catch (err) {
        console.error(err);
      }
    };
    loadFormData();
  }, []);

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      // Validar tamaño máximo 2MB (2048 KB)
      if (file.size > 2 * 1024 * 1024) {
        setErrorMessage('El tamaño de la imagen no debe superar los 2 MB.');
        return;
      }
      setLogoFile(file);
      setLogoPreview(URL.createObjectURL(file));
      setErrorMessage(null);
    }
  };

  const removeLogo = () => {
    setLogoFile(null);
    if (logoPreview) {
      URL.revokeObjectURL(logoPreview);
      setLogoPreview(null);
    }
  };

  const toggleCategory = (id: number) => {
    if (selectedCategories.includes(id)) {
      setSelectedCategories(selectedCategories.filter((catId) => catId !== id));
    } else {
      setSelectedCategories([...selectedCategories, id]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    // Validaciones en React
    if (!name.trim()) {
      setErrorMessage('Por favor ingresa el nombre comercial del negocio.');
      return;
    }
    if (!cityId) {
      setErrorMessage('Por favor selecciona una ciudad o departamento de Nicaragua.');
      return;
    }
    if (selectedCategories.length === 0) {
      setErrorMessage('Debes seleccionar al menos un rubro o categoría para tu negocio.');
      return;
    }
    if (!address.trim()) {
      setErrorMessage('La dirección física es obligatoria.');
      return;
    }
    if (!phone.trim()) {
      setErrorMessage('El teléfono de contacto es obligatorio.');
      return;
    }

    try {
      setSubmitting(true);
      const formData = new FormData();
      formData.append('name', name.trim());
      formData.append('city_id', cityId);
      selectedCategories.forEach((catId) => {
        formData.append('categories[]', String(catId));
      });
      if (shortDescription.trim()) formData.append('short_description', shortDescription.trim());
      if (description.trim()) formData.append('description', description.trim());
      formData.append('address', address.trim());
      formData.append('phone', phone.trim());
      if (whatsapp.trim()) formData.append('whatsapp', whatsapp.trim());
      if (email.trim()) formData.append('email', email.trim());
      if (website.trim()) formData.append('website', website.trim());
      if (openingHours.trim()) formData.append('opening_hours', openingHours.trim());
      if (facebook.trim()) formData.append('facebook', facebook.trim());
      if (instagram.trim()) formData.append('instagram', instagram.trim());

      if (logoFile) {
        formData.append('logo', logoFile);
      }

      const res = await api.post('/owner/businesses', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setSuccessMessage(res.data.message || 'Negocio registrado exitosamente.');
      setTimeout(() => {
        navigate('/owner/dashboard');
      }, 2000);
    } catch (err: any) {
      setErrorMessage(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-neutral-50 py-16 px-4">
        <div className="max-w-md mx-auto bg-white p-8 rounded-3xl border border-neutral-200 text-center shadow-md">
          <div className="w-16 h-16 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mx-auto mb-4">
            <Building2 className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-black text-neutral-900 mb-2">Registra tu Negocio</h2>
          <p className="text-xs text-neutral-600 mb-6">
            Para publicar y gestionar tu negocio en las Páginas Amarillas de Nicaragua, inicia sesión o crea una cuenta gratis en menos de un minuto.
          </p>
          <div className="space-y-3">
            <Link
              to="/login?redirect=/register-business"
              className="w-full flex items-center justify-center bg-amber-400 hover:bg-amber-500 text-neutral-950 font-bold py-3 rounded-xl text-xs transition-colors shadow-sm"
            >
              Iniciar Sesión
            </Link>
            <Link
              to="/register?role=owner&redirect=/register-business"
              className="w-full flex items-center justify-center bg-neutral-900 hover:bg-neutral-800 text-white font-bold py-3 rounded-xl text-xs transition-colors"
            >
              Crear Cuenta de Dueño
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 py-10">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-8">
          <span className="inline-block px-3 py-1 bg-amber-400/30 text-neutral-900 text-xs font-black rounded-full uppercase tracking-wider mb-2">
            Formulario de Registro
          </span>
          <h1 className="text-3xl font-black text-neutral-900 uppercase">
            Registra tu Empresa en Páginas Amarillas
          </h1>
          <p className="text-xs sm:text-sm text-neutral-600 mt-1 max-w-xl mx-auto">
            Completa la ficha técnica para que miles de nicaragüenses puedan contactarte por llamada, WhatsApp y visitarte en tu local.
          </p>
        </div>

        {/* Alerts */}
        {errorMessage && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 flex items-start gap-3 text-xs">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <div>
              <p className="font-bold">Error en el registro:</p>
              <p>{errorMessage}</p>
            </div>
          </div>
        )}

        {successMessage && (
          <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-start gap-3 text-xs">
            <CheckCircle className="w-5 h-5 shrink-0" />
            <div>
              <p className="font-bold">¡Registro Exitoso!</p>
              <p>{successMessage}</p>
              <p className="mt-1 font-semibold text-emerald-600">Redirigiendo a tu panel de negocios...</p>
            </div>
          </div>
        )}

        {/* Notice Info */}
        <div className="mb-6 p-4 rounded-xl bg-amber-50 border border-amber-200 text-neutral-800 flex items-start gap-3 text-xs">
          <Info className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <p>
            <strong>Nota de Publicación:</strong> Para garantizar la calidad y autenticidad del directorio, cada nuevo negocio registrado pasa por un proceso de revisión y aprobación administrativa antes de estar visible públicamente en el catálogo.
          </p>
        </div>

        {/* Main Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-3xl border border-neutral-200 shadow-sm p-6 sm:p-10 space-y-8"
        >
          {/* Sección 1: Datos Generales */}
          <div>
            <h2 className="text-base font-black text-neutral-900 uppercase tracking-wider border-b border-neutral-100 pb-2 mb-4 flex items-center gap-2">
              <Building2 className="w-4 h-4 text-amber-500" />
              1. Identidad del Negocio
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Nombre Comercial */}
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-neutral-800 mb-1">
                  Nombre Comercial del Negocio <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ej. Restaurante & Asados Doña María"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-400/20 text-xs font-medium outline-none transition-all"
                />
              </div>

              {/* Ciudad / Departamento */}
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-neutral-800 mb-1">
                  Ciudad o Municipio de Nicaragua <span className="text-red-500">*</span>
                </label>
                <select
                  required
                  value={cityId}
                  onChange={(e) => setCityId(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-400/20 text-xs font-medium outline-none transition-all bg-white"
                >
                  <option value="">Selecciona una ciudad</option>
                  {cities.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} — Departamento de {c.department}
                    </option>
                  ))}
                </select>
              </div>

              {/* Rubros / Categorías */}
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-neutral-800 mb-1">
                  Rubros o Categorías <span className="text-red-500">*</span>{' '}
                  <span className="text-neutral-500 font-normal">(puedes seleccionar varios)</span>
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-2">
                  {categories.map((cat) => {
                    const isSelected = selectedCategories.includes(cat.id);
                    return (
                      <button
                        type="button"
                        key={cat.id}
                        onClick={() => toggleCategory(cat.id)}
                        className={`px-3 py-2 rounded-xl text-xs font-semibold border text-left transition-all flex items-center justify-between cursor-pointer ${
                          isSelected
                            ? 'bg-amber-400 border-amber-500 text-neutral-950 font-bold shadow-xs'
                            : 'bg-neutral-50 hover:bg-neutral-100 border-neutral-200 text-neutral-700'
                        }`}
                      >
                        <span className="truncate">{cat.name}</span>
                        {isSelected && <CheckCircle className="w-3.5 h-3.5 text-neutral-950 shrink-0 ml-1" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Descripción breve */}
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-neutral-800 mb-1">
                  Descripción Corta / Eslogan{' '}
                  <span className="text-neutral-500 font-normal">(máx. 255 caracteres)</span>
                </label>
                <input
                  type="text"
                  maxLength={255}
                  value={shortDescription}
                  onChange={(e) => setShortDescription(e.target.value)}
                  placeholder="Ej. Especialistas en cortes de carne, comida típica nica y eventos familiares."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-400/20 text-xs font-medium outline-none transition-all"
                />
              </div>

              {/* Descripción completa */}
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-neutral-800 mb-1">
                  Descripción Completa y Servicios
                </label>
                <textarea
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe con detalle tus productos, servicios, formas de pago, promociones y trayectoria..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-400/20 text-xs font-medium outline-none transition-all"
                />
              </div>
            </div>
          </div>

          {/* Sección 2: Contacto y Ubicación */}
          <div>
            <h2 className="text-base font-black text-neutral-900 uppercase tracking-wider border-b border-neutral-100 pb-2 mb-4 flex items-center gap-2">
              <Phone className="w-4 h-4 text-amber-500" />
              2. Contactos y Ubicación
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Teléfono */}
              <div>
                <label className="block text-xs font-bold text-neutral-800 mb-1">
                  Teléfono de Contacto <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Ej. +505 2255 8800 o 8888 1234"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 focus:border-amber-500 text-xs font-medium outline-none"
                />
              </div>

              {/* WhatsApp */}
              <div>
                <label className="block text-xs font-bold text-neutral-800 mb-1">
                  Número de WhatsApp <span className="text-neutral-500 font-normal">(con código de país)</span>
                </label>
                <input
                  type="tel"
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  placeholder="Ej. +505 8888 1234"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 focus:border-amber-500 text-xs font-medium outline-none"
                />
              </div>

              {/* Correo */}
              <div>
                <label className="block text-xs font-bold text-neutral-800 mb-1">
                  Correo Electrónico Comercial
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="contacto@tunegocio.com.ni"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 focus:border-amber-500 text-xs font-medium outline-none"
                />
              </div>

              {/* Sitio Web */}
              <div>
                <label className="block text-xs font-bold text-neutral-800 mb-1">
                  Sitio Web Oficial <span className="text-neutral-500 font-normal">(opcional)</span>
                </label>
                <input
                  type="url"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  placeholder="https://tunegocio.com.ni"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 focus:border-amber-500 text-xs font-medium outline-none"
                />
              </div>

              {/* Dirección Física */}
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-neutral-800 mb-1">
                  Dirección Física <span className="text-red-500">*</span>{' '}
                  <span className="text-neutral-500 font-normal">(formato nica: de la rotonda, semáforos, etc.)</span>
                </label>
                <input
                  type="text"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Ej. De la Rotonda El Güegüense 2c. al sur, 25 vrs. arriba, Managua"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 focus:border-amber-500 text-xs font-medium outline-none"
                />
              </div>

              {/* Horarios */}
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-neutral-800 mb-1">
                  Horarios de Atención
                </label>
                <input
                  type="text"
                  value={openingHours}
                  onChange={(e) => setOpeningHours(e.target.value)}
                  placeholder="Ej. Lunes a Viernes: 8:00 AM - 5:00 PM | Sábados: 8:00 AM - 12:00 PM"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 focus:border-amber-500 text-xs font-medium outline-none"
                />
              </div>

              {/* Redes Sociales: Facebook & Instagram */}
              <div>
                <label className="block text-xs font-bold text-neutral-800 mb-1">
                  Página de Facebook
                </label>
                <input
                  type="url"
                  value={facebook}
                  onChange={(e) => setFacebook(e.target.value)}
                  placeholder="https://facebook.com/tunegocio"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 focus:border-amber-500 text-xs font-medium outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-800 mb-1">
                  Perfil de Instagram
                </label>
                <input
                  type="url"
                  value={instagram}
                  onChange={(e) => setInstagram(e.target.value)}
                  placeholder="https://instagram.com/tunegocio"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 focus:border-amber-500 text-xs font-medium outline-none"
                />
              </div>
            </div>
          </div>

          {/* Sección 3: Logo del Negocio */}
          <div>
            <h2 className="text-base font-black text-neutral-900 uppercase tracking-wider border-b border-neutral-100 pb-2 mb-4 flex items-center gap-2">
              <Upload className="w-4 h-4 text-amber-500" />
              3. Logo o Imagen Comercial
            </h2>

            <div className="space-y-4">
              <p className="text-xs text-neutral-500">
                Sube el logo de tu empresa en formato JPG, PNG, WEBP o SVG. Tamaño máximo permitido: <strong>2 MB</strong>.
              </p>

              {logoPreview ? (
                <div className="flex items-center gap-4 bg-neutral-50 p-4 rounded-2xl border border-neutral-200">
                  <div className="w-20 h-20 rounded-xl overflow-hidden bg-white border border-neutral-300 shadow-sm shrink-0">
                    <img src={logoPreview} alt="Previsualización" className="w-full h-full object-cover" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-neutral-800 truncate max-w-xs">{logoFile?.name}</p>
                    <p className="text-[11px] text-neutral-500">
                      {logoFile ? (logoFile.size / 1024).toFixed(1) + ' KB' : ''}
                    </p>
                    <button
                      type="button"
                      onClick={removeLogo}
                      className="inline-flex items-center space-x-1 text-xs text-red-600 hover:text-red-700 font-bold cursor-pointer pt-1"
                    >
                      <X className="w-3.5 h-3.5" />
                      <span>Eliminar imagen</span>
                    </button>
                  </div>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center border-2 border-dashed border-neutral-300 hover:border-amber-500 bg-neutral-50/50 hover:bg-amber-50/30 rounded-2xl p-8 cursor-pointer transition-colors group">
                  <Upload className="w-8 h-8 text-neutral-400 group-hover:text-amber-500 transition-colors mb-2" />
                  <span className="text-xs font-bold text-neutral-700 group-hover:text-amber-700">
                    Haz clic para seleccionar o arrastra tu logo aquí
                  </span>
                  <span className="text-[10px] text-neutral-400 mt-1">PNG, JPG, WEBP, SVG hasta 2MB</span>
                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/jpg,image/webp,image/svg+xml"
                    onChange={handleLogoChange}
                    className="hidden"
                  />
                </label>
              )}
            </div>
          </div>

          {/* Submit Action */}
          <div className="pt-4 border-t border-neutral-100 flex flex-col sm:flex-row items-center justify-end gap-3">
            <Link
              to="/owner/dashboard"
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-neutral-300 text-neutral-700 text-xs font-bold text-center hover:bg-neutral-50"
            >
              Cancelar
            </Link>
            <button
              type="submit"
              disabled={submitting}
              className="w-full sm:w-auto bg-amber-400 hover:bg-amber-500 text-neutral-950 font-black px-8 py-3 rounded-xl text-xs sm:text-sm shadow-md hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {submitting ? 'Enviando Registro...' : 'Registrar y Enviar a Revisión'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
