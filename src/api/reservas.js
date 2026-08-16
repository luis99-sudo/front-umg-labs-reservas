import api from './api';
import { obtenerUsuarioActual } from './sesion';

export const listarReservas = (filtros = {}) => {
  const params = {};
  if (filtros.labId) params.labId = filtros.labId;
  if (filtros.fecha) params.fecha = filtros.fecha;
  if (filtros.userId) params.userId = filtros.userId;
  return api.get('/reservas/', { params }).then((r) => r.data);
};

export const obtenerReserva = (id) => api.get(`/reservas/${id}/`).then((r) => r.data);

export const crearReserva = (datos) => api.post('/reservas/', datos).then((r) => r.data);

// El "solicitante" (para permisos + bitácora) siempre es el usuario en
// sesión — nunca se pide ni se elige manualmente. Va como query param en
// vez de header X-User-ID porque un header custom dispara preflight de CORS
// y el backend no lo tiene permitido en CORS_ALLOW_HEADERS.
export const cancelarReserva = (id) => {
  const usuario = obtenerUsuarioActual();
  const params = usuario?.UMG_ID ? { solicitanteId: usuario.UMG_ID } : {};
  return api.patch(`/reservas/${id}/cancelar/`, null, { params }).then((r) => r.data);
};

// Mismo motivo: el solicitante va como campo del body (UMG_Solicitante_ID),
// que la vista de modificar también acepta, en vez del header bloqueado.
export const modificarReserva = (id, datos) => {
  const usuario = obtenerUsuarioActual();
  const payload = { ...datos, ...(usuario?.UMG_ID ? { UMG_Solicitante_ID: usuario.UMG_ID } : {}) };
  return api.put(`/reservas/${id}/modificar/`, payload).then((r) => r.data);
};
