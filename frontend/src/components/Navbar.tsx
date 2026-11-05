import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  BookOpen,
  PlusCircle,
  LogOut,
  ShieldCheck,
  Menu,
  X,
  Building2,
  MapPin,
  Tag,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, logout, isAdmin, isOwner } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    setUserDropdownOpen(false);
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-neutral-200 shadow-sm">
      {/* Top Banner amarillo distintivo de Páginas Amarillas */}
      <div className="bg-amber-400 text-neutral-950 px-4 py-1.5 text-xs font-semibold flex items-center justify-between">
        <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="inline-block w-2 h-2 rounded-full bg-neutral-950"></span>
            <span>Directorio Comercial y Telefónico de Nicaragua • Edición 2025</span>
          </div>
          <div className="hidden md:flex items-center space-x-4 text-xs font-medium">
            <Link to="/cities" className="hover:underline flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5" /> Explorar por Departamento
            </Link>
            <span>|</span>
            <Link to="/categories" className="hover:underline flex items-center gap-1">
              <Tag className="w-3.5 h-3.5" /> Ver Categorías
            </Link>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="bg-amber-400 p-2 rounded-xl text-neutral-950 group-hover:bg-amber-500 transition-colors shadow-sm">
              <BookOpen className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-1">
                <span className="text-xl font-black tracking-tight text-neutral-900 uppercase">
                  Páginas<span className="text-amber-500">Amarillas</span>
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-neutral-900 text-amber-400 px-1.5 py-0.5 rounded">
                  NI
                </span>
              </div>
              <p className="text-[10px] font-semibold text-neutral-500 tracking-wide">
                Directorio Comercial y de Contactos
              </p>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link
              to="/directory"
              className="text-sm font-semibold text-neutral-700 hover:text-amber-600 transition-colors"
            >
              Directorio de Negocios
            </Link>
            <Link
              to="/categories"
              className="text-sm font-semibold text-neutral-700 hover:text-amber-600 transition-colors"
            >
              Rubros y Categorías
            </Link>
            <Link
              to="/cities"
              className="text-sm font-semibold text-neutral-700 hover:text-amber-600 transition-colors"
            >
              Ciudades
            </Link>
          </nav>

          {/* Actions / User Menu */}
          <div className="hidden md:flex items-center space-x-3">
            {/* Botón Publicar Negocio */}
            <Link
              to="/register-business"
              className="flex items-center space-x-1.5 bg-amber-400 hover:bg-amber-500 text-neutral-950 px-4 py-2 rounded-lg font-bold text-sm shadow-sm hover:shadow transition-all border border-amber-500/30"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Publicar Negocio</span>
            </Link>

            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center space-x-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 px-3 py-2 rounded-lg text-sm font-medium transition-colors border border-neutral-300"
                >
                  <div className="w-7 h-7 rounded-full bg-amber-400 text-neutral-900 flex items-center justify-center font-bold text-xs">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="max-w-[120px] truncate">{user.name}</span>
                  <span
                    className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded ${
                      isAdmin
                        ? 'bg-purple-100 text-purple-700'
                        : isOwner
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-neutral-200 text-neutral-700'
                    }`}
                  >
                    {isAdmin ? 'Admin' : isOwner ? 'Dueño' : 'Visitante'}
                  </span>
                </button>

                {/* Dropdown Menu */}
                {userDropdownOpen && (
                  <div
                    onMouseLeave={() => setUserDropdownOpen(false)}
                    className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-neutral-200 py-1.5 z-50"
                  >
                    <div className="px-4 py-2 border-b border-neutral-100">
                      <p className="text-xs text-neutral-500">Sesión iniciada como</p>
                      <p className="text-sm font-bold text-neutral-900 truncate">{user.name}</p>
                      <p className="text-xs text-neutral-500 truncate">{user.email}</p>
                    </div>

                    {isOwner && (
                      <Link
                        to="/owner/dashboard"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center space-x-2 px-4 py-2 text-sm text-neutral-700 hover:bg-amber-50 hover:text-amber-800"
                      >
                        <Building2 className="w-4 h-4 text-neutral-500" />
                        <span>Mis Negocios</span>
                      </Link>
                    )}

                    {isAdmin && (
                      <Link
                        to="/admin/dashboard"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center space-x-2 px-4 py-2 text-sm text-neutral-700 hover:bg-purple-50 hover:text-purple-800"
                      >
                        <ShieldCheck className="w-4 h-4 text-purple-600" />
                        <span>Panel de Administración</span>
                      </Link>
                    )}

                    <div className="border-t border-neutral-100 my-1"></div>

                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center space-x-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 text-left"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Cerrar Sesión</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  to="/login"
                  className="text-sm font-bold text-neutral-800 hover:text-amber-600 px-3 py-2 rounded-lg hover:bg-neutral-100 transition-colors"
                >
                  Ingresar
                </Link>
                <Link
                  to="/register"
                  className="text-sm font-bold bg-neutral-900 text-white hover:bg-neutral-800 px-3.5 py-2 rounded-lg transition-colors shadow-sm"
                >
                  Registrarse
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-neutral-700 hover:bg-neutral-100 focus:outline-none"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-neutral-200 bg-white px-4 pt-3 pb-6 space-y-3 shadow-lg">
          <Link
            to="/directory"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-semibold text-neutral-800 hover:bg-amber-50"
          >
            Directorio de Negocios
          </Link>
          <Link
            to="/categories"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-semibold text-neutral-800 hover:bg-amber-50"
          >
            Rubros y Categorías
          </Link>
          <Link
            to="/cities"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-semibold text-neutral-800 hover:bg-amber-50"
          >
            Ciudades de Nicaragua
          </Link>

          <div className="pt-2 border-t border-neutral-100 space-y-2">
            <Link
              to="/register-business"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full flex items-center justify-center space-x-2 bg-amber-400 text-neutral-950 font-bold px-4 py-2.5 rounded-lg shadow-sm"
            >
              <PlusCircle className="w-5 h-5" />
              <span>Publicar Negocio</span>
            </Link>

            {user ? (
              <>
                {isOwner && (
                  <Link
                    to="/owner/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-2 rounded-lg text-sm font-semibold text-neutral-700 hover:bg-neutral-100"
                  >
                    Mis Negocios Registrados
                  </Link>
                )}
                {isAdmin && (
                  <Link
                    to="/admin/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-2 rounded-lg text-sm font-semibold text-purple-700 hover:bg-purple-50"
                  >
                    Panel de Administración
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-3 py-2 rounded-lg text-sm font-semibold text-red-600 hover:bg-red-50"
                >
                  Cerrar Sesión ({user.name})
                </button>
              </>
            ) : (
              <div className="grid grid-cols-2 gap-2 pt-1">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center font-bold text-neutral-800 border border-neutral-300 py-2 rounded-lg text-sm"
                >
                  Ingresar
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center font-bold bg-neutral-900 text-white py-2 rounded-lg text-sm"
                >
                  Registrarse
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
