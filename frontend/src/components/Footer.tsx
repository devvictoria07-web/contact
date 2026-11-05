import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Phone, Mail, MapPin, Shield } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-neutral-900 text-neutral-300 pt-12 pb-8 border-t-4 border-amber-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Callout para dueños de negocios */}
        <div className="bg-neutral-800 rounded-2xl p-6 sm:p-8 mb-12 flex flex-col md:flex-row items-center justify-between gap-6 border border-neutral-700 shadow-md">
          <div className="space-y-2 text-center md:text-left">
            <span className="inline-block px-3 py-1 bg-amber-400/20 text-amber-400 text-xs font-bold rounded-full uppercase tracking-wider">
              Para Empresas y Emprendedores
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-white">
              ¿Tienes un negocio en Nicaragua? ¡Haz que te encuentren!
            </h3>
            <p className="text-neutral-400 text-sm max-w-2xl">
              Publica tu negocio de forma rápida y gratuita en el directorio comercial más completo del país. Muestra tu teléfono, WhatsApp, horarios, dirección y redes sociales.
            </p>
          </div>
          <Link
            to="/register-business"
            className="whitespace-nowrap bg-amber-400 hover:bg-amber-300 text-neutral-950 font-black px-6 py-3.5 rounded-xl text-sm transition-all shadow-lg hover:shadow-amber-400/20 transform hover:-translate-y-0.5"
          >
            Registrar Mi Negocio Gratis
          </Link>
        </div>

        {/* 4 Columnas principales */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Columna 1: Marca & Contacto */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="bg-amber-400 p-2 rounded-lg text-neutral-950">
                <BookOpen className="w-5 h-5 stroke-[2.5]" />
              </div>
              <span className="text-lg font-black tracking-tight text-white uppercase">
                Páginas<span className="text-amber-400">Amarillas</span> NI
              </span>
            </div>
            <p className="text-xs text-neutral-400 leading-relaxed">
              La plataforma de búsqueda comercial y directorio de contactos empresariales de referencia en Nicaragua. Conectando clientes y negocios desde Managua hasta el Caribe.
            </p>
            <div className="space-y-2 text-xs text-neutral-400 pt-2">
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Managua, Nicaragua</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-amber-400 shrink-0" />
                <span>+505 2255-8800 / +505 8888-1234</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-amber-400 shrink-0" />
                <span>contacto@paginasamarillas.com.ni</span>
              </div>
            </div>
          </div>

          {/* Columna 2: Ciudades más consultadas */}
          <div>
            <h4 className="text-white font-bold text-sm mb-4 uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-2 h-2 rounded bg-amber-400"></span>
              Ciudades de Nicaragua
            </h4>
            <ul className="space-y-2 text-xs text-neutral-400">
              <li>
                <Link to="/directory?city=managua" className="hover:text-amber-400 transition-colors">
                  Negocios en Managua
                </Link>
              </li>
              <li>
                <Link to="/directory?city=leon" className="hover:text-amber-400 transition-colors">
                  Negocios en León
                </Link>
              </li>
              <li>
                <Link to="/directory?city=granada" className="hover:text-amber-400 transition-colors">
                  Negocios en Granada
                </Link>
              </li>
              <li>
                <Link to="/directory?city=masaya" className="hover:text-amber-400 transition-colors">
                  Negocios en Masaya
                </Link>
              </li>
              <li>
                <Link to="/directory?city=matagalpa" className="hover:text-amber-400 transition-colors">
                  Negocios en Matagalpa
                </Link>
              </li>
              <li>
                <Link to="/directory?city=esteli" className="hover:text-amber-400 transition-colors">
                  Negocios en Estelí
                </Link>
              </li>
              <li>
                <Link to="/directory?city=san-juan-del-sur" className="hover:text-amber-400 transition-colors">
                  Negocios en San Juan del Sur / Rivas
                </Link>
              </li>
            </ul>
          </div>

          {/* Columna 3: Rubros Populares */}
          <div>
            <h4 className="text-white font-bold text-sm mb-4 uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-2 h-2 rounded bg-amber-400"></span>
              Rubros Populares
            </h4>
            <ul className="space-y-2 text-xs text-neutral-400">
              <li>
                <Link to="/directory?category=restaurantes-y-cafeterias" className="hover:text-amber-400 transition-colors">
                  Restaurantes y Comida Típica
                </Link>
              </li>
              <li>
                <Link to="/directory?category=farmacias-y-salud" className="hover:text-amber-400 transition-colors">
                  Farmacias y Clínicas 24 Horas
                </Link>
              </li>
              <li>
                <Link to="/directory?category=ferreterias-y-construccion" className="hover:text-amber-400 transition-colors">
                  Ferreterías y Materiales
                </Link>
              </li>
              <li>
                <Link to="/directory?category=servicios-profesionales" className="hover:text-amber-400 transition-colors">
                  Abogados y Notarios Públicos
                </Link>
              </li>
              <li>
                <Link to="/directory?category=hoteles-y-turismo" className="hover:text-amber-400 transition-colors">
                  Hoteles y Hospedajes
                </Link>
              </li>
              <li>
                <Link to="/directory?category=talleres-y-automotriz" className="hover:text-amber-400 transition-colors">
                  Talleres Mecánicos y Repuestos
                </Link>
              </li>
              <li>
                <Link to="/directory?category=tecnologia-y-computacion" className="hover:text-amber-400 transition-colors">
                  Computación y Cámaras de Seguridad
                </Link>
              </li>
            </ul>
          </div>

          {/* Columna 4: Accesos Rápidos & Cuenta */}
          <div>
            <h4 className="text-white font-bold text-sm mb-4 uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-2 h-2 rounded bg-amber-400"></span>
              Cuenta & Soporte
            </h4>
            <ul className="space-y-2 text-xs text-neutral-400">
              <li>
                <Link to="/login" className="hover:text-amber-400 transition-colors">
                  Iniciar Sesión
                </Link>
              </li>
              <li>
                <Link to="/register" className="hover:text-amber-400 transition-colors">
                  Crear Cuenta de Dueño
                </Link>
              </li>
              <li>
                <Link to="/register-business" className="hover:text-amber-400 transition-colors">
                  Publicar mi Negocio
                </Link>
              </li>
              <li>
                <Link to="/directory" className="hover:text-amber-400 transition-colors">
                  Buscador Completo
                </Link>
              </li>
              <li>
                <span className="inline-flex items-center gap-1 text-neutral-500 pt-2">
                  <Shield className="w-3.5 h-3.5" /> Negocios auditados por administradores
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Barra inferior */}
        <div className="pt-8 border-t border-neutral-800 text-xs text-neutral-500 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} Páginas Amarillas Nicaragua. Todos los derechos reservados.</p>
          <div className="flex items-center space-x-6">
            <span>Laravel 13 REST API + React 19 + TypeScript</span>
            <span className="text-amber-400 font-bold">Nicaragua</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
