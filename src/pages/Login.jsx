import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { FlaskConical } from 'lucide-react';
import { login as loginRequest } from '../api/auth';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [cargando, setCargando] = useState(false);
  const { iniciarSesion, estaAutenticado, esAdmin } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (estaAutenticado) {
      navigate(esAdmin ? '/admin/reservas' : '/docente/nueva-reserva', { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const manejarEnvio = async (e) => {
    e.preventDefault();
    if (!correo.trim() || !contrasena) {
      toast.error('Ingresa tu correo y contraseña.');
      return;
    }
    setCargando(true);
    try {
      const datos = await loginRequest(correo.trim(), contrasena);
      iniciarSesion(datos);
      navigate(datos.UMG_Rol_Nombre === 'Admin' ? '/admin/reservas' : '/docente/nueva-reserva');
    } catch (err) {
      toast.error(err?.response?.data?.mensaje || 'No se pudo iniciar sesión.');
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-brand-700 text-white mb-4">
            <FlaskConical size={22} />
          </div>
          <h1 className="font-display text-2xl text-slate-900">Reserva de laboratorios</h1>
          <p className="text-sm text-slate-500 mt-1">Ingresa con tu correo institucional</p>
        </div>
        <form onSubmit={manejarEnvio} className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-sm">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Correo institucional</label>
            <input
              type="email"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-600 focus:border-brand-600"
              placeholder="docente@miumg.edu.gt"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Contraseña</label>
            <input
              type="password"
              value={contrasena}
              onChange={(e) => setContrasena(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-600 focus:border-brand-600"
              placeholder="••••••••"
            />
          </div>
          <button
            type="submit"
            disabled={cargando}
            className="w-full rounded-lg bg-brand-700 text-white text-sm font-medium py-2.5 hover:bg-brand-800 transition disabled:opacity-60"
          >
            {cargando ? 'Ingresando...' : 'Ingresar'}
          </button>
        </form>
      </div>
    </div>
  );
}
