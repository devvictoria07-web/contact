import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Lock,
  Mail,
  AlertCircle,
  ArrowRight,
  Eye,
  EyeOff,
  CheckCircle2,
  Building2,
  Shield,
  User,
} from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get('redirect') || '/';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const res = await login(email, password);
    setLoading(false);

    if (res.success) {
      navigate(redirect);
    } else {
      setError(res.message || 'Credenciales incorrectas');
    }
  };

  const fillQuickAccount = (e: string, p: string) => {
    setEmail(e);
    setPassword(p);
    setError(null);
  };

  return (
    <div className="min-h-[calc(100vh-110px)] bg-neutral-100/80 py-8 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="max-w-4xl w-full bg-white rounded-3xl border border-neutral-200/90 shadow-xl overflow-hidden grid grid-cols-1 md:grid-cols-12">
        {/* Left Panel: Brand & Value Proposition */}
        <div className="md:col-span-5 bg-neutral-900 text-white p-8 flex flex-col justify-between relative">
          <div>
            <Link to="/" className="inline-flex items-center gap-3 group">
              <img
                src="/logo-transparent.png"
                alt="Nuevo Milenium"
                className="w-11 h-11 object-contain bg-white rounded-xl p-1 shadow-sm group-hover:scale-105 transition-transform"
              />
              <div>
                <span className="block text-lg font-black tracking-tight uppercase leading-none">
                  Nuevo<span className="text-amber-400">Milenium</span>
                </span>
                <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">
                  PANM • Nicaragua
                </span>
              </div>
            </Link>

            <h1 className="mt-8 text-2xl font-black tracking-tight leading-snug">
              Conecta tu negocio con miles de clientes en Nicaragua
            </h1>
            <p className="mt-2 text-xs text-neutral-400 leading-relaxed">
              Administra la información de tu empresa, mantén actualizados tus teléfonos y recibe consultas directas por WhatsApp.
            </p>
          </div>

          <div className="mt-8 space-y-3.5 border-t border-neutral-800 pt-6">
            <div className="flex items-start gap-2.5 text-xs text-neutral-300">
              <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <span>Publicación gratuita en el directorio comercial nacional.</span>
            </div>
            <div className="flex items-start gap-2.5 text-xs text-neutral-300">
              <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <span>Actualización inmediata de horarios, dirección y WhatsApp.</span>
            </div>
            <div className="flex items-start gap-2.5 text-xs text-neutral-300">
              <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <span>Presencia por categoría y departamento en todo el país.</span>
            </div>
          </div>
        </div>

        {/* Right Panel: Login Form */}
        <div className="md:col-span-7 p-6 sm:p-10 flex flex-col justify-center">
          <div className="mb-6">
            <h2 className="text-2xl font-black text-neutral-900 tracking-tight">
              Iniciar Sesión
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-neutral-500">
              Ingresa tu correo electrónico y contraseña para continuar.
            </p>
          </div>

          {error && (
            <div
              role="alert"
              className="mb-5 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 flex items-start gap-2.5 text-xs font-medium"
            >
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="login-email"
                className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1.5"
              >
                Correo Electrónico
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  id="login-email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ejemplo@correo.com"
                  className="w-full pl-10 pr-4 py-2.5 bg-neutral-50 focus:bg-white rounded-xl border border-neutral-300 focus:border-amber-500 focus:ring-4 focus:ring-amber-400/15 text-sm text-neutral-900 font-medium outline-none transition-all"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="login-password"
                className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1.5"
              >
                Contraseña
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-11 py-2.5 bg-neutral-50 focus:bg-white rounded-xl border border-neutral-300 focus:border-amber-500 focus:ring-4 focus:ring-amber-400/15 text-sm text-neutral-900 font-medium outline-none transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-neutral-400 hover:text-neutral-700 transition-colors cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 bg-amber-400 hover:bg-amber-500 active:scale-[0.99] text-neutral-950 font-black py-3 rounded-xl text-sm shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
            >
              <span>{loading ? 'Verificando...' : 'Iniciar Sesión'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-neutral-100 text-center">
            <p className="text-xs sm:text-sm text-neutral-600">
              ¿No tienes una cuenta aún?{' '}
              <Link
                to={`/register${redirect !== '/' ? `?redirect=${encodeURIComponent(redirect)}` : ''}`}
                className="font-bold text-amber-600 hover:text-amber-700 hover:underline"
              >
                Regístrate gratis
              </Link>
            </p>
          </div>

          {/* Discreet Quick Access for Testing */}
          <div className="mt-5 pt-4 border-t border-dashed border-neutral-200">
            <p className="text-[11px] font-semibold text-neutral-400 text-center mb-2">
              Acceso rápido de prueba
            </p>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => fillQuickAccount('admin@nuevomillenium.com.ni', 'admin123')}
                className="inline-flex items-center justify-center gap-1.5 px-2.5 py-1.5 bg-neutral-50 hover:bg-amber-50 hover:border-amber-300 text-neutral-700 border border-neutral-200 rounded-lg text-[11px] font-semibold transition-colors cursor-pointer"
              >
                <Shield className="w-3.5 h-3.5 text-amber-600" />
                <span>Admin</span>
              </button>
              <button
                type="button"
                onClick={() => fillQuickAccount('propietario@ejemplo.com', 'owner123')}
                className="inline-flex items-center justify-center gap-1.5 px-2.5 py-1.5 bg-neutral-50 hover:bg-amber-50 hover:border-amber-300 text-neutral-700 border border-neutral-200 rounded-lg text-[11px] font-semibold transition-colors cursor-pointer"
              >
                <Building2 className="w-3.5 h-3.5 text-amber-600" />
                <span>Propietario</span>
              </button>
              <button
                type="button"
                onClick={() => fillQuickAccount('visitante@ejemplo.com', 'visitor123')}
                className="inline-flex items-center justify-center gap-1.5 px-2.5 py-1.5 bg-neutral-50 hover:bg-amber-50 hover:border-amber-300 text-neutral-700 border border-neutral-200 rounded-lg text-[11px] font-semibold transition-colors cursor-pointer"
              >
                <User className="w-3.5 h-3.5 text-amber-600" />
                <span>Visitante</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
