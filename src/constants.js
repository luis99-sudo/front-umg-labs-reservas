// El backend no expone GET /api/roles/, así que los IDs se fijan aquí
// según lo confirmado: 1 = Admin, 2 = Docente.
export const ROLES = [
  { id: 1, nombre: 'Admin' },
  { id: 2, nombre: 'Docente' },
];

// Horario hábil: hardcodeado también en el backend (reservas/views.py),
// no hay endpoint que lo exponga. Si cambia en el backend, debe cambiar aquí.
export const HORA_HABIL_INICIO = '07:00';
export const HORA_HABIL_FIN = '22:00';
export const DURACION_MAXIMA_MINUTOS = 240;

export const TIPOS_CONDICION = ['Asueto', 'Mantenimiento', 'Actividad'];

export const ESTADOS_RESERVA = {
  R: { etiqueta: 'Reservada', clase: 'bg-brand-100 text-brand-800' },
  C: { etiqueta: 'Cancelada', clase: 'bg-red-100 text-red-700' },
  F: { etiqueta: 'Finalizada', clase: 'bg-slate-100 text-slate-600' },
};
