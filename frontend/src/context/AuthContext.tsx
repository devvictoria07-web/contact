import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';
import type { User, UserRole } from '../types';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  register: (data: {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
    phone?: string;
    role?: UserRole;
  }) => Promise<{ success: boolean; message?: string }>;
  logout: () => Promise<void>;
  isAdmin: boolean;
  isOwner: boolean;
  isVisitor: boolean;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('directcontact_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem('directcontact_token');
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Verificar sesión activa al montar
  useEffect(() => {
    const checkAuth = async () => {
      const storedToken = localStorage.getItem('directcontact_token');
      if (storedToken) {
        try {
          const res = await api.get('/auth/me');
          setUser(res.data.user);
          localStorage.setItem('directcontact_user', JSON.stringify(res.data.user));
        } catch {
          // Token inválido o expirado
          localStorage.removeItem('directcontact_token');
          localStorage.removeItem('directcontact_user');
          setUser(null);
          setToken(null);
        }
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const res = await api.post('/auth/login', { email, password });
      const { user: userData, token: userToken, message } = res.data;

      localStorage.setItem('directcontact_token', userToken);
      localStorage.setItem('directcontact_user', JSON.stringify(userData));

      setUser(userData);
      setToken(userToken);

      return { success: true, message };
    } catch (err: any) {
      const msg = err.response?.data?.message || err.response?.data?.errors?.email?.[0] || 'Error al iniciar sesión';
      return { success: false, message: msg };
    }
  };

  const register = async (data: {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
    phone?: string;
    role?: UserRole;
  }) => {
    try {
      const res = await api.post('/auth/register', data);
      const { user: userData, token: userToken, message } = res.data;

      localStorage.setItem('directcontact_token', userToken);
      localStorage.setItem('directcontact_user', JSON.stringify(userData));

      setUser(userData);
      setToken(userToken);

      return { success: true, message };
    } catch (err: any) {
      let msg = err.response?.data?.message;
      if (!msg && err.response?.data?.errors) {
        const errorEntries = Object.values(err.response.data.errors) as any[];
        if (errorEntries.length > 0 && Array.isArray(errorEntries[0])) {
          msg = errorEntries[0][0];
        }
      }
      return { success: false, message: msg || 'Error al registrar la cuenta' };
    }
  };

  const logout = async () => {
    try {
      if (token) {
        await api.post('/auth/logout');
      }
    } catch {
      // Ignorar error al cerrar sesión
    } finally {
      localStorage.removeItem('directcontact_token');
      localStorage.removeItem('directcontact_user');
      setUser(null);
      setToken(null);
    }
  };

  const refreshUser = async () => {
    if (!token) return;
    try {
      const res = await api.get('/auth/me');
      setUser(res.data.user);
      localStorage.setItem('directcontact_user', JSON.stringify(res.data.user));
    } catch (e) {
      console.error(e);
    }
  };

  const isAdmin = user?.role === 'admin';
  const isOwner = user?.role === 'owner' || user?.role === 'admin';
  const isVisitor = user?.role === 'visitor';

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        login,
        register,
        logout,
        isAdmin,
        isOwner,
        isVisitor,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser utilizado dentro de un AuthProvider');
  }
  return context;
};
