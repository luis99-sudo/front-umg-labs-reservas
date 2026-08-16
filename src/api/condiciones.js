import api from './api';

export const listarCondiciones = () => api.get('/condiciones/').then((r) => r.data);

export const crearCondicion = (datos) => api.post('/condiciones/', datos).then((r) => r.data);

export const editarCondicion = (id, datos) => api.put(`/condiciones/${id}/`, datos).then((r) => r.data);
