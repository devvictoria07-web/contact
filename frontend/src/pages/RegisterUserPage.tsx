import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import type { UserRole } from '../types';
import {
  BookOpen,
  User,
  Mail,
  Lock,
  Phone,
  Building,
  Eye,
  AlertCircle,
  ArrowRight,
} from 'lucide-react';

export const RegisterUserPage: React.FC = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get('redirect') || '/';
  const roleParam = (searchParams.get('role') as UserRole) || 'owner';

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [role, setRole] = useState<UserRole>(roleParam);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== passwordConfirmation) {
      setError('Las contraseñas no coinciden.');
      return;
    }

    if (password.length < 8) {
      setError('La contraseña debe contener al menos 8 caracteres.');
      return;
    }

    setLoading(true);
    const res = await register({
      name,
      email,
      phone,
      password,
      password_confirmation: passwordConfirmation,
      role,
    });
    setLoading(false);

    if (res.success) {
      navigate(redirect);
    } else {
      setError(res.message || 'Error al crear la cuenta');
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 py-12 px-4 sm:px-6 lg:px-8 flex flex-col justify-center">
      <div className="max-w-md w-full mx-auto space-y-6">
        {/* Header */}
        <div className="text-center">
          <Link to="/" className="inline-flex items-center space-x-2">
            <div className="bg-amber-400 p-2.5 rounded-2xl text-neutral-950 shadow-sm">
              <BookOpen className="w-7 h-7 stroke-[2.5]" />
            </div>
            <span className="text-2xl font-black tracking-tight text-neutral-900 uppercase">
              Páginas<span className="text-amber-500">Amarillas</span>
            </span>
          </Link>
          <h2 className="mt-4 text-2xl font-black text-neutral-900">
            Crear Nueva Cuenta
          </h2>
          <p className="mt-1 text-xs text-neutral-600">
            Únete a la red comercial de contactos más grande de Nicaragua
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white py-8 px-6 sm:px-8 rounded-3xl border border-neutral-200 shadow-md">
          {error && (
            <div className="mb-5 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 flex items-start gap-2.5 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Selector de Rol */}
            <div>
              <label className="block text-xs font-bold text-neutral-800 uppercase tracking-wider mb-1.5">
                Tipo de Cuenta
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setRole('owner')}
                  className={`p-3 rounded-xl border text-xs font-bold text-left transition-all flex flex-col gap-1 cursor-pointer ${
                    role === 'owner'
                      ? 'bg-amber-50 border-amber-500 text-amber-950 ring-2 ring-amber-400/30'
                      : 'bg-neutral-50 border-neutral-200 text-neutral-600 hover:bg-neutral-100'
                  }`}
                >
                  <div className="flex items-center gap-1.5 font-black text-xs">
                    <Building className="w-4 h-4 text-amber-500" />
                    <span>Dueño de Negocio</span>
                  </div>
                  <span className="text-[10px] text-neutral-500 font-normal">
                    Publicar y gestionar fichas
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setRole('visitor')}
                  className={`p-3 rounded-xl border text-xs font-bold text-left transition-all flex flex-col gap-1 cursor-pointer ${
                    role === 'visitor'
                      ? 'bg-amber-50 border-amber-500 text-amber-950 ring-2 ring-amber-400/30'
                      : 'bg-neutral-50 border-neutral-200 text-neutral-600 hover:bg-neutral-100'
                  }`}
                >
                  <div className="flex items-center gap-1.5 font-black text-xs">
                    <Eye className="w-4 h-4 text-amber-500" />
                    <span>Visitante</span>
                  </div>
                  <span className="text-[10px] text-neutral-500 font-normal">
                    Consultar contactos
                  </span>
                </button>
              </div>
            </div>

            {/* Nombre Completo */}
            <div>
              <label className="block text-xs font-bold text-neutral-800 uppercase tracking-wider mb-1">
                Nombre Completo <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ej. Juan Pérez"
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-neutral-300 focus:border-amber-500 text-xs font-medium outline-none"
                />
              </div>
            </div>

            {/* Correo */}
            <div>
              <label className="block text-xs font-bold text-neutral-800 uppercase tracking-wider mb-1">
                Correo Electrónico <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ejemplo@correo.com"
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-neutral-300 focus:border-amber-500 text-xs font-medium outline-none"
                />
              </div>
            </div>

            {/* Teléfono */}
            <div>
              <label className="block text-xs font-bold text-neutral-800 uppercase tracking-wider mb-1">
                Teléfono / Celular <span className="text-neutral-400 font-normal">(opcional)</span>
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+505 8888 1234"
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-neutral-300 focus:border-amber-500 text-xs font-medium outline-none"
                />
              </div>
            </div>

            {/* Contraseña */}
            <div>
              <label className="block text-xs font-bold text-neutral-800 uppercase tracking-wider mb-1">
                Contraseña <span className="text-red-500">*</span>{' '}
                <span className="text-[10px] text-neutral-400 font-normal">(mínimo 8 caracteres)</span>
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-neutral-300 focus:border-amber-500 text-xs font-medium outline-none"
                />
              </div>
            </div>

            {/* Confirmar Contraseña */}
            <div>
              <label className="block text-xs font-bold text-neutral-800 uppercase tracking-wider mb-1">
                Confirmar Contraseña <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={passwordConfirmation}
                  onChange={(e) => setPasswordConfirmation(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-neutral-300 focus:border-amber-500 text-xs font-medium outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 bg-amber-400 hover:bg-amber-500 text-neutral-950 font-black py-3 rounded-xl text-xs sm:text-sm shadow-md transition-all flex items-center justify-center space-x-2 disabled:opacity-50 cursor-pointer"
            >
              <span>{loading ? 'Creando Cuenta...' : 'Registrar Mi Cuenta'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-neutral-100 text-center">
            <p className="text-xs text-neutral-600">
              ¿Ya tienes cuenta registrada?{' '}
              <Link to="/login" className="font-bold text-amber-600 hover:underline">
                Inicia sesión aquí
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

