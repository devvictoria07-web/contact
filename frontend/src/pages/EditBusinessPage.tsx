import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api, getErrorMessage } from '../services/api';
import type { Category, City, Business } from '../types';
import {
  Upload,
  Building2,
  Phone,
  CheckCircle,
  AlertCircle,
  ArrowLeft,
} from 'lucide-react';

export const EditBusinessPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { isAdmin } = useAuth();
  const navigate = useNavigate();

  const [cities, setCities] = useState<City[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingInitial, setLoadingInitial] = useState(true);

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

  // Existing logo & new logo file state
  const [currentLogoUrl, setCurrentLogoUrl] = useState<string | null>(null);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  // Status & errors
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [cityRes, catRes, bizRes] = await Promise.all([
          api.get('/cities'),
          api.get('/categories'),
          api.get(isAdmin ? `/admin/businesses/${id}` : `/owner/businesses/${id}`),
        ]);

        setCities(cityRes.data);
        setCategories(catRes.data);

        const b: Business = bizRes.data;
        setName(b.name);
        setCityId(String(b.city_id));
        setSelectedCategories(b.categories?.map((c) => c.id) || []);
        setShortDescription(b.short_description || '');
        setDescription(b.description || '');
        setAddress(b.address);
        setPhone(b.phone);
        setWhatsapp(b.whatsapp || '');
        setEmail(b.email || '');
        setWebsite(b.website || '');
        setOpeningHours(b.opening_hours || '');
        setFacebook(b.facebook || '');
        setInstagram(b.instagram || '');
        setCurrentLogoUrl(b.logo_url || null);
      } catch (err: any) {
        setErrorMessage(getErrorMessage(err));
      } finally {
        setLoadingInitial(false);
      }
    };

    if (id) {
      loadData();
    }
  }, [id, isAdmin]);

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
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

  const toggleCategory = (catId: number) => {
    if (selectedCategories.includes(catId)) {
      setSelectedCategories(selectedCategories.filter((c) => c !== catId));
    } else {
      setSelectedCategories([...selectedCategories, catId]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!name.trim()) {
      setErrorMessage('El nombre del negocio es obligatorio.');
      return;
    }
    if (!cityId) {
      setErrorMessage('Selecciona una ciudad.');
      return;
    }
    if (selectedCategories.length === 0) {
      setErrorMessage('Selecciona al menos una categoría.');
      return;
    }
    if (!address.trim()) {
      setErrorMessage('La dirección es obligatoria.');
      return;
    }
    if (!phone.trim()) {
      setErrorMessage('El teléfono es obligatorio.');
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

      const endpoint = isAdmin ? `/admin/businesses/${id}` : `/owner/businesses/${id}`;
      const res = await api.post(endpoint, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setSuccessMessage(res.data.message || 'Negocio actualizado correctamente.');
      setTimeout(() => {
        navigate(isAdmin ? '/admin/dashboard' : '/owner/dashboard');
      }, 1500);
    } catch (err: any) {
      setErrorMessage(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingInitial) {
    return (
      <div className="min-h-screen bg-neutral-50 py-16 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-amber-400 border-t-neutral-900 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 py-10">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center space-x-1.5 text-xs font-bold text-neutral-600 hover:text-amber-600 transition-colors mb-6 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Volver al Panel</span>
        </button>

        <div className="text-center mb-8">
          <span className="inline-block px-3 py-1 bg-amber-400/30 text-neutral-900 text-xs font-black rounded-full uppercase tracking-wider mb-2">
            Edición de Ficha Comercial
          </span>
          <h1 className="text-3xl font-black text-neutral-900 uppercase">
            Editar Información del Negocio
          </h1>
          <p className="text-xs text-neutral-600 mt-1">
            Mantén tus teléfonos, WhatsApp, horarios y ubicación siempre actualizados.
          </p>
        </div>

        {errorMessage && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 flex items-start gap-3 text-xs">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <div>
              <p className="font-bold">Error:</p>
              <p>{errorMessage}</p>
            </div>
          </div>
        )}

        {successMessage && (
          <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-start gap-3 text-xs">
            <CheckCircle className="w-5 h-5 shrink-0" />
            <div>
              <p className="font-bold">¡Actualización Exitosa!</p>
              <p>{successMessage}</p>
            </div>
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-3xl border border-neutral-200 shadow-sm p-6 sm:p-10 space-y-8"
        >
          {/* Identidad */}
          <div>
            <h2 className="text-base font-black text-neutral-900 uppercase tracking-wider border-b border-neutral-100 pb-2 mb-4 flex items-center gap-2">
              <Building2 className="w-4 h-4 text-amber-500" />
              1. Identidad del Negocio
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-neutral-800 mb-1">
                  Nombre Comercial <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 focus:border-amber-500 text-xs font-medium outline-none"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-neutral-800 mb-1">
                  Ciudad o Municipio <span className="text-red-500">*</span>
                </label>
                <select
                  required
                  value={cityId}
                  onChange={(e) => setCityId(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 focus:border-amber-500 text-xs font-medium outline-none bg-white"
                >
                  <option value="">Selecciona una ciudad</option>
                  {cities.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} — {c.department}
                    </option>
                  ))}
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-neutral-800 mb-1">
                  Rubros / Categorías <span className="text-red-500">*</span>
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

              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-neutral-800 mb-1">
                  Descripción Corta
                </label>
                <input
                  type="text"
                  maxLength={255}
                  value={shortDescription}
                  onChange={(e) => setShortDescription(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 focus:border-amber-500 text-xs font-medium outline-none"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-neutral-800 mb-1">
                  Descripción Completa
                </label>
                <textarea
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 focus:border-amber-500 text-xs font-medium outline-none"
                />
              </div>
            </div>
          </div>

          {/* Contacto y Ubicación */}
          <div>
            <h2 className="text-base font-black text-neutral-900 uppercase tracking-wider border-b border-neutral-100 pb-2 mb-4 flex items-center gap-2">
              <Phone className="w-4 h-4 text-amber-500" />
              2. Contactos y Ubicación
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-neutral-800 mb-1">
                  Teléfono <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 focus:border-amber-500 text-xs font-medium outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-800 mb-1">
                  WhatsApp
                </label>
                <input
                  type="tel"
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 focus:border-amber-500 text-xs font-medium outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-800 mb-1">
                  Correo Electrónico
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 focus:border-amber-500 text-xs font-medium outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-800 mb-1">
                  Sitio Web
                </label>
                <input
                  type="url"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 focus:border-amber-500 text-xs font-medium outline-none"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-neutral-800 mb-1">
                  Dirección Física <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 focus:border-amber-500 text-xs font-medium outline-none"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-neutral-800 mb-1">
                  Horarios de Atención
                </label>
                <input
                  type="text"
                  value={openingHours}
                  onChange={(e) => setOpeningHours(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 focus:border-amber-500 text-xs font-medium outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-800 mb-1">
                  Facebook
                </label>
                <input
                  type="url"
                  value={facebook}
                  onChange={(e) => setFacebook(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 focus:border-amber-500 text-xs font-medium outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-800 mb-1">
                  Instagram
                </label>
                <input
                  type="url"
                  value={instagram}
                  onChange={(e) => setInstagram(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 focus:border-amber-500 text-xs font-medium outline-none"
                />
              </div>
            </div>
          </div>

          {/* Logo */}
          <div>
            <h2 className="text-base font-black text-neutral-900 uppercase tracking-wider border-b border-neutral-100 pb-2 mb-4 flex items-center gap-2">
              <Upload className="w-4 h-4 text-amber-500" />
              3. Actualizar Logo o Imagen
            </h2>

            <div className="space-y-4">
              {/* Logo actual */}
              {currentLogoUrl && !logoPreview && (
                <div className="flex items-center gap-4 bg-neutral-50 p-4 rounded-2xl border border-neutral-200">
                  <div className="w-16 h-16 rounded-xl overflow-hidden bg-white border border-neutral-300 shrink-0">
                    <img src={currentLogoUrl} alt="Logo actual" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-neutral-800">Logo actual guardado</p>
                    <p className="text-[11px] text-neutral-500">Selecciona un nuevo archivo abajo si deseas reemplazarlo.</p>
                  </div>
                </div>
              )}

              {logoPreview ? (
                <div className="flex items-center gap-4 bg-amber-50 p-4 rounded-2xl border border-amber-200">
                  <div className="w-16 h-16 rounded-xl overflow-hidden bg-white border border-neutral-300 shrink-0">
                    <img src={logoPreview} alt="Nuevo logo" className="w-full h-full object-cover" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-neutral-800">Nueva imagen seleccionada: {logoFile?.name}</p>
                    <button
                      type="button"
                      onClick={removeLogo}
                      className="text-xs text-red-600 hover:underline font-bold cursor-pointer"
                    >
                      Cancelar cambio de imagen
                    </button>
                  </div>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center border-2 border-dashed border-neutral-300 hover:border-amber-500 bg-neutral-50/50 hover:bg-amber-50/30 rounded-2xl p-6 cursor-pointer transition-colors group">
                  <Upload className="w-6 h-6 text-neutral-400 group-hover:text-amber-500 transition-colors mb-1" />
                  <span className="text-xs font-bold text-neutral-700">Subir nueva imagen o logo</span>
                  <span className="text-[10px] text-neutral-400">PNG, JPG, WEBP, SVG hasta 2MB</span>
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

          <div className="pt-4 border-t border-neutral-100 flex flex-col sm:flex-row items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-neutral-300 text-neutral-700 text-xs font-bold text-center hover:bg-neutral-50 cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="w-full sm:w-auto bg-amber-400 hover:bg-amber-500 text-neutral-950 font-black px-8 py-3 rounded-xl text-xs sm:text-sm shadow-md transition-all disabled:opacity-50 cursor-pointer"
            >
              {submitting ? 'Guardando Cambios...' : 'Guardar Cambios'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
