import api from './api';

export const listarReservas = (filtros = {}) => {
  const params = {};
  if (filtros.labId) params.labId = filtros.labId;
  if (filtros.fecha) params.fecha = filtros.fecha;
  if (filtros.userId) params.userId = filtros.userId;
  return api.get('/reservas/', { params }).then((r) => r.data);
};

export const obtenerReserva = (id) => api.get(`/reservas/${id}/`).then((r) => r.data);

export const crearReserva = (datos) => api.post('/reservas/', datos).then((r) => r.data);

// El X-User-ID (solicitante) lo agrega automáticamente el interceptor de api.js.
export const cancelarReserva = (id) => api.patch(`/reservas/${id}/cancelar/`).then((r) => r.data);

export const modificarReserva = (id, datos) =>
  api.put(`/reservas/${id}/modificar/`, datos).then((r) => r.data);
