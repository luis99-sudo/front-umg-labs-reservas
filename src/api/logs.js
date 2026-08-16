import api from './api';

export const listarLogs = (umgUserId) =>
  api.get('/logs/', { params: { UMG_User_ID: umgUserId } }).then((r) => r.data);
