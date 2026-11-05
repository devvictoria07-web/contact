import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';

import { HomePage } from './pages/HomePage';
import { DirectoryPage } from './pages/DirectoryPage';
import { BusinessDetailPage } from './pages/BusinessDetailPage';
import { CategoriesPage } from './pages/CategoriesPage';
import { CitiesPage } from './pages/CitiesPage';
import { RegisterBusinessPage } from './pages/RegisterBusinessPage';
import { EditBusinessPage } from './pages/EditBusinessPage';
import { OwnerDashboardPage } from './pages/OwnerDashboardPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterUserPage } from './pages/RegisterUserPage';

const getBasename = () => {
  if (typeof window !== 'undefined' && window.location.pathname.startsWith('/directcontact')) {
    return '/directcontact';
  }
  return '';
};

// Componente para proteger rutas privadas
const ProtectedRoute: React.FC<{ children: React.ReactNode; adminOnly?: boolean }> = ({
  children,
  adminOnly = false,
}) => {
  const { user, isLoading, isAdmin } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50">
        <div className="w-8 h-8 border-4 border-amber-400 border-t-neutral-900 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && !isAdmin) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <BrowserRouter basename={getBasename()}>
        <div className="min-h-screen flex flex-col bg-neutral-50 font-sans text-neutral-800">
          <Navbar />
          <main className="flex-1">
            <Routes>
              {/* Rutas Públicas */}
              <Route path="/" element={<HomePage />} />
              <Route path="/directory" element={<DirectoryPage />} />
              <Route path="/business/:slug" element={<BusinessDetailPage />} />
              <Route path="/categories" element={<CategoriesPage />} />
              <Route path="/cities" element={<CitiesPage />} />

              {/* Autenticación */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterUserPage />} />

              {/* Registro de negocio */}
              <Route path="/register-business" element={<RegisterBusinessPage />} />

              {/* Rutas Protegidas para Dueño de Negocio */}
              <Route
                path="/owner/dashboard"
                element={
                  <ProtectedRoute>
                    <OwnerDashboardPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/owner/edit-business/:id"
                element={
                  <ProtectedRoute>
                    <EditBusinessPage />
                  </ProtectedRoute>
                }
              />

              {/* Rutas Protegidas para Administrador */}
              <Route
                path="/admin/dashboard"
                element={
                  <ProtectedRoute adminOnly>
                    <AdminDashboardPage />
                  </ProtectedRoute>
                }
              />

              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
