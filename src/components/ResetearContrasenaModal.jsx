import React, { useState } from 'react';
import toast from 'react-hot-toast';
import Modal from './Modal';
import { resetearContrasena } from '../api/usuarios';

export default function ResetearContrasenaModal({ usuario, onClose, onExito }) {
  const [temporal, setTemporal] = useState('');
  const [guardando, setGuardando] = useState(false);

  const guardar = async (e) => {
    e.preventDefault();
    if (temporal.length < 6) {
      toast.error('La contraseña temporal debe tener al menos 6 caracteres.');
      return;
    }
    setGuardando(true);
    try {
      await resetearContrasena(usuario.UMG_ID, temporal);
      toast.success('Contraseña reseteada. El usuario deberá cambiarla al ingresar.');
      onExito();
    } catch (err) {
      toast.error(err?.response?.data?.mensaje || 'No se pudo resetear la contraseña.');
    } finally {
      setGuardando(false);
    }
  };

  return (
    <Modal
      titulo={`Resetear contraseña — ${usuario.UMG_Nombre} ${usuario.UMG_Apellido}`}
      onClose={onClose}
      ancho="max-w-sm"
    >
      <form onSubmit={guardar} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Contraseña temporal</label>
          <input
            type="password"
            value={temporal}
            onChange={(e) => setTemporal(e.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
          />
        </div>
        <div className="flex justify-end gap-2 pt-1">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium rounded-lg text-slate-700 hover:bg-slate-100"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={guardando}
            className="px-4 py-2 text-sm font-medium rounded-lg bg-brand-700 text-white hover:bg-brand-800 disabled:opacity-60"
          >
            {guardando ? 'Guardando...' : 'Resetear'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
