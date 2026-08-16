import axios from 'axios';

export const STORAGE_KEY = 'umg_usuario';

const API_URL = import.meta.env.VITE_API_URL || 'https://umg-api-django.onrender.com/api';

const api = axios.create({ baseURL: API_URL });

// Adjunta automáticamente el ID del usuario logueado como X-User-ID en cada
// request. El backend lo usa como "solicitante" para validar permisos
// (creador o Admin) en /reservas/{id}/cancelar/ y /reservas/{id}/modificar/,
// y para registrar en la bitácora quién ejecutó la acción. Nunca se pide
// manualmente: siempre es la sesión activa, nunca una selección del usuario.
api.interceptors.request.use((config) => {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (raw) {
      const usuario = JSON.parse(raw);
      if (usuario?.UMG_ID) {
        config.headers['X-User-ID'] = usuario.UMG_ID;
      }
    }
  } catch {
    // Storage corrupto: seguimos sin el header: el backend respalda con 400/403.
  }
  return config;
});

export default api;
