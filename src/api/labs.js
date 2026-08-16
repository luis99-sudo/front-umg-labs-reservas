import api from './api';

export const listarLabs = () => api.get('/labs/').then((r) => r.data);

export const crearLab = (nombre) => api.post('/labs/', { UMG_Nombre: nombre }).then((r) => r.data);

export const editarLab = (id, datos) => api.put(`/labs/${id}/`, datos).then((r) => r.data);

export const labsDisponibles = (fecha, horaInicio, horaFin) =>
  api
    .get('/labs/disponibles/', { params: { fecha, hora_inicio: horaInicio, hora_fin: horaFin } })
    .then((r) => r.data);
