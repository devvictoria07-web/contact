import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Lock, Mail, AlertCircle, Eye, EyeOff, UserCheck, ChevronDown } from 'lucide-react';

type AccessType = 'owner' | 'admin';

export const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get('redirect');

  const [accessType, setAccessType] = useState<AccessType>('owner');
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
      if (redirect) {
        navigate(redirect);
      } else {
        navigate(accessType === 'admin' ? '/admin' : '/owner');
      }
    } else {
      setError(res.message || 'Credenciales incorrectas.');
    }
  };

  return (
    <div className="min-h-[calc(100vh-110px)] bg-neutral-100 py-8 px-4 flex flex-col items-center justify-center">
      <div className="max-w-[420px] w-full bg-white rounded-2xl border border-neutral-200/90 shadow-xl p-8 sm:p-10">
        {/* Brand Header */}
        <div className="text-center">
          <Link to="/" className="inline-block">
            <img
              src="/logo-transparent.png"
              alt="Nuevo Milenium"
              className="w-16 h-16 object-contain mx-auto"
            />
          </Link>
          <p className="mt-3 text-xs font-extrabold tracking-widest text-neutral-800 uppercase">
            Páginas Amarillas Nuevo Milenium
          </p>
        </div>

        <hr className="my-5 border-neutral-100" />

        <h1 className="text-xl font-bold text-neutral-900 text-center mb-6">
          Iniciar sesión
        </h1>

        {error && (
          <div
            role="alert"
            className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 flex items-start gap-2 text-xs font-medium"
          >
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Tipo de Acceso */}
          <div className="relative">
            <UserCheck className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <select
              id="login-access-type"
              aria-label="Tipo de acceso"
              value={accessType}
              onChange={(e) => setAccessType(e.target.value as AccessType)}
              className="w-full appearance-none pl-10 pr-9 py-2.5 bg-white rounded-lg border border-neutral-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-400/20 text-sm text-neutral-800 font-medium outline-none transition-all cursor-pointer"
            >
              <option value="owner">Propietario</option>
              <option value="admin">Administrador</option>
            </select>
            <ChevronDown className="w-4 h-4 text-neutral-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Correo */}
          <div className="relative">
            <Mail className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              id="login-email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Correo electrónico"
              className="w-full pl-10 pr-4 py-2.5 bg-white rounded-lg border border-neutral-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-400/20 text-sm text-neutral-900 placeholder:text-neutral-400 outline-none transition-all"
            />
          </div>

          {/* Contraseña */}
          <div className="relative">
            <Lock className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              id="login-password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Contraseña"
              className="w-full pl-10 pr-10 py-2.5 bg-white rounded-lg border border-neutral-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-400/20 text-sm text-neutral-900 placeholder:text-neutral-400 outline-none transition-all"
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700 transition-colors cursor-pointer"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>

          {/* Botón e Ir a Registro */}
          <div className="pt-2 flex items-center justify-between gap-4">
            <button
              type="submit"
              disabled={loading}
              className="bg-amber-400 hover:bg-amber-500 active:scale-[0.99] text-neutral-950 font-bold px-6 py-2.5 rounded-lg text-xs uppercase tracking-wide shadow-xs transition-all disabled:opacity-50 cursor-pointer"
            >
              {loading ? 'Verificando...' : 'Iniciar sesión'}
            </button>

            <Link
              to={`/register${redirect ? `?redirect=${encodeURIComponent(redirect)}` : ''}`}
              className="text-xs font-semibold text-amber-600 hover:text-amber-700 hover:underline"
            >
              Crear cuenta
            </Link>
          </div>
        </form>
      </div>

      <p className="mt-6 text-[11px] text-neutral-500 text-center">
        © {new Date().getFullYear()} Páginas Amarillas Nuevo Milenium • Nicaragua
      </p>
    </div>
  );
};
