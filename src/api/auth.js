import api from './api';

export const login = (correo, contrasena) =>
  api
    .post('/auth/login/', { UMG_Usuario: correo, UMG_Contrasena: contrasena })
    .then((r) => r.data);

export const cambiarContrasena = (umgId, nuevaContrasena) =>
  api
    .post('/auth/cambiar-contrasena/', { UMG_ID: umgId, NuevaContrasena: nuevaContrasena })
    .then((r) => r.data);
