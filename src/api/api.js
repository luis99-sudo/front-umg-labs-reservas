import axios from 'axios';

export const STORAGE_KEY = 'umg_usuario';

const API_URL = import.meta.env.VITE_API_URL || 'https://umg-api-django.onrender.com/api';

const api = axios.create({ baseURL: API_URL });

// Importante: NO se agrega ningún header custom (como X-User-ID) por
// interceptor. El backend no tiene 'x-user-id' en CORS_ALLOW_HEADERS, así
// que cualquier header custom convierte hasta un GET simple en una
// "non-simple request" que dispara preflight, y el navegador la bloquea
// por completo. El "solicitante" para cancelar/modificar reservas se manda
// como query param o campo del body (ver src/api/sesion.js y
// src/api/reservas.js), que la vista del backend también acepta.

export default api;
