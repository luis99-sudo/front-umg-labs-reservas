import api from './api';

export const listarUsuarios = () => api.get('/usuarios/').then((r) => r.data);

export const crearUsuario = (datos) => api.post('/usuarios/', datos).then((r) => r.data);

export const inactivarUsuario = (id) => api.patch(`/usuarios/${id}/inactivar/`).then((r) => r.data);

export const resetearContrasena = (id, contrasenaTemporal) =>
  api
    .patch(`/usuarios/${id}/resetear-contrasena/`, { ContrasenaTemporal: contrasenaTemporal })
    .then((r) => r.data);
