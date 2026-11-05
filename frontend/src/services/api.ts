import axios from 'axios';

const getApiBaseUrl = () => {
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  if (typeof window !== 'undefined') {
    if (window.location.pathname.startsWith('/directcontact')) {
      return '/directcontact/api';
    }
  }
  return '/api';
};

export const api = axios.create({
  baseURL: getApiBaseUrl(),
  headers: {
    'Accept': 'application/json',
  },
});

// Interceptor para inyectar token de Sanctum automáticamente
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('directcontact_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Función auxiliar para extraer mensajes de error legibles
export const getErrorMessage = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    if (error.response?.data?.message) {
      return error.response.data.message;
    }
    if (error.response?.data?.errors) {
      const firstKey = Object.keys(error.response.data.errors)[0];
      return error.response.data.errors[firstKey][0];
    }
    if (error.message) {
      return error.message;
    }
  }
  return 'Ocurrió un error inesperado. Por favor, intenta de nuevo.';
};
