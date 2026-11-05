import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { BookOpen, Lock, Mail, AlertCircle, Users, ArrowRight } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get('redirect') || '/';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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
  };

  return (
    <div className="min-h-screen bg-neutral-50 py-12 px-4 sm:px-6 lg:px-8 flex flex-col justify-center">
      <div className="max-w-md w-full mx-auto space-y-8">
        {/* Brand Header */}
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
            Ingreso al Directorio
          </h2>
          <p className="mt-1 text-xs text-neutral-600">
            Accede para publicar, gestionar tus empresas o administrar el portal.
          </p>
        </div>

        {/* Demo Fast Login Buttons */}
        <div className="bg-amber-50 rounded-2xl p-4 border border-amber-200">
          <div className="flex items-center gap-1.5 text-xs font-bold text-amber-950 mb-2">
            <Users className="w-4 h-4 text-amber-700" />
            <span>Cuentas de demostración (acceso rápido):</span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => fillQuickAccount('admin@paginasamarillas.com.ni', 'admin123')}
              className="px-2.5 py-1.5 bg-white hover:bg-neutral-900 hover:text-amber-400 text-neutral-800 border border-neutral-300 rounded-lg text-[11px] font-bold text-center transition-all cursor-pointer shadow-2xs"
            >
              👑 Administrador
            </button>
            <button
              type="button"
              onClick={() => fillQuickAccount('propietario@ejemplo.com', 'owner123')}
              className="px-2.5 py-1.5 bg-white hover:bg-neutral-900 hover:text-amber-400 text-neutral-800 border border-neutral-300 rounded-lg text-[11px] font-bold text-center transition-all cursor-pointer shadow-2xs"
            >
              🏢 Propietario
            </button>
            <button
              type="button"
              onClick={() => fillQuickAccount('visitante@ejemplo.com', 'visitor123')}
              className="px-2.5 py-1.5 bg-white hover:bg-neutral-900 hover:text-amber-400 text-neutral-800 border border-neutral-300 rounded-lg text-[11px] font-bold text-center transition-all cursor-pointer shadow-2xs"
            >
              👤 Visitante
            </button>
          </div>
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
            <div>
              <label className="block text-xs font-bold text-neutral-800 uppercase tracking-wider mb-1">
                Correo Electrónico
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ejemplo@correo.com"
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-neutral-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-400/20 text-xs font-medium outline-none transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-800 uppercase tracking-wider mb-1">
                Contraseña
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-neutral-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-400/20 text-xs font-medium outline-none transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 bg-amber-400 hover:bg-amber-500 text-neutral-950 font-black py-3 rounded-xl text-xs sm:text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center space-x-2 disabled:opacity-50 cursor-pointer"
            >
              <span>{loading ? 'Verificando...' : 'Iniciar Sesión'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-neutral-100 text-center">
            <p className="text-xs text-neutral-600">
              ¿No tienes una cuenta aún?{' '}
              <Link
                to={`/register${redirect ? `?redirect=${encodeURIComponent(redirect)}` : ''}`}
                className="font-bold text-amber-600 hover:underline"
              >
                Regístrate aquí
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

