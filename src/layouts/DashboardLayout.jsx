import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  CalendarPlus,
  ListChecks,
  CalendarDays,
  Users,
  Building2,
  Lock,
  History,
  LogOut,
  KeyRound,
  FlaskConical,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import CambiarContrasenaModal from '../components/CambiarContrasenaModal';

const enlacesDocente = [
  { to: '/docente/nueva-reserva', label: 'Nueva reserva', Icono: CalendarPlus },
  { to: '/docente/mis-reservas', label: 'Mis reservas', Icono: ListChecks },
];

const enlacesAdmin = [
  { to: '/admin/reservas', label: 'Reservas', Icono: CalendarDays },
  { to: '/admin/usuarios', label: 'Usuarios', Icono: Users },
  { to: '/admin/laboratorios', label: 'Laboratorios', Icono: Building2 },
  { to: '/admin/bloqueos', label: 'Bloqueos', Icono: Lock },
  { to: '/admin/bitacora', label: 'Bitácora', Icono: History },
];

export default function DashboardLayout() {
  const { usuario, esAdmin, cerrarSesion, actualizarUsuario } = useAuth();
  const [modalAbierto, setModalAbierto] = useState(false);
  const navigate = useNavigate();

  const enlaces = esAdmin ? enlacesAdmin : enlacesDocente;
  const cambioObligatorio = usuario?.RequiereCambioContrasena === true;

  const salir = () => {
    cerrarSesion();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <aside className="w-64 shrink-0 bg-brand-900 text-brand-50 flex flex-col">
        <div className="h-16 flex items-center gap-2 px-5 border-b border-white/10">
          <FlaskConical size={20} className="text-amber-400" />
          <span className="font-display text-base tracking-tight">UMG Labs</span>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-1">
          {enlaces.map(({ to, label, Icono }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                  isActive ? 'bg-white/10 text-white' : 'text-brand-100/70 hover:bg-white/5 hover:text-white'
                }`
              }
            >
              <Icono size={18} />
              {label}
            </NavLink>
          ))}
        </nav>
        <div className="px-3 py-4 border-t border-white/10">
          <button
            onClick={() => setModalAbierto(true)}
            className="w-full flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-brand-100/70 hover:bg-white/5 hover:text-white transition"
          >
            <KeyRound size={18} />
            Cambiar contraseña
          </button>
          <button
            onClick={salir}
            className="w-full flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-brand-100/70 hover:bg-white/5 hover:text-white transition"
          >
            <LogOut size={18} />
            Cerrar sesión
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-end px-6 gap-3">
          <div className="text-right">
            <p className="text-sm font-medium text-slate-800 leading-tight">
              {usuario?.UMG_Nombre} {usuario?.UMG_Apellido}
            </p>
            <p className="text-xs text-slate-500 leading-tight">{usuario?.UMG_Rol_Nombre}</p>
          </div>
          <span
            className={`inline-flex h-9 w-9 items-center justify-center rounded-full text-xs font-semibold ${
              esAdmin ? 'bg-amber-100 text-amber-800' : 'bg-brand-100 text-brand-800'
            }`}
          >
            {usuario?.UMG_Nombre?.[0]}
            {usuario?.UMG_Apellido?.[0]}
          </span>
        </header>
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>

      {(modalAbierto || cambioObligatorio) && (
        <CambiarContrasenaModal
          forzado={cambioObligatorio}
          onClose={() => setModalAbierto(false)}
          onExito={() => {
            if (cambioObligatorio) actualizarUsuario({ RequiereCambioContrasena: false });
            setModalAbierto(false);
          }}
        />
      )}
    </div>
  );
}
