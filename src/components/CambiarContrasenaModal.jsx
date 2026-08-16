import React, { useState } from 'react';
import toast from 'react-hot-toast';
import Modal from './Modal';
import { cambiarContrasena } from '../api/auth';
import { useAuth } from '../context/AuthContext';

export default function CambiarContrasenaModal({ forzado = false, onClose, onExito }) {
  const { usuario } = useAuth();
  const [nueva, setNueva] = useState('');
  const [confirmacion, setConfirmacion] = useState('');
  const [cargando, setCargando] = useState(false);

  const manejarEnvio = async (e) => {
    e.preventDefault();
    if (nueva.length < 6) {
      toast.error('La contraseña debe tener al menos 6 caracteres.');
      return;
    }
    if (nueva !== confirmacion) {
      toast.error('Las contraseñas no coinciden.');
      return;
    }
    setCargando(true);
    try {
      await cambiarContrasena(usuario.UMG_ID, nueva);
      toast.success('Contraseña actualizada correctamente.');
      onExito();
    } catch (err) {
      toast.error(err?.response?.data?.mensaje || 'No se pudo actualizar la contraseña.');
    } finally {
      setCargando(false);
    }
  };

  return (
    <Modal titulo="Cambiar contraseña" onClose={onClose} ocultarCierre={forzado} ancho="max-w-sm">
      {forzado && (
        <p className="text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 mb-4">
          Un administrador reseteó tu contraseña. Define una nueva antes de continuar.
        </p>
      )}
      <form onSubmit={manejarEnvio} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Nueva contraseña</label>
          <input
            type="password"
            value={nueva}
            onChange={(e) => setNueva(e.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-600"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Confirmar contraseña</label>
          <input
            type="password"
            value={confirmacion}
            onChange={(e) => setConfirmacion(e.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-600"
          />
        </div>
        <div className="flex justify-end gap-2 pt-1">
          {!forzado && (
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium rounded-lg text-slate-700 hover:bg-slate-100"
            >
              Cancelar
            </button>
          )}
          <button
            type="submit"
            disabled={cargando}
            className="px-4 py-2 text-sm font-medium rounded-lg bg-brand-700 text-white hover:bg-brand-800 disabled:opacity-60"
          >
            {cargando ? 'Guardando...' : 'Guardar'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
