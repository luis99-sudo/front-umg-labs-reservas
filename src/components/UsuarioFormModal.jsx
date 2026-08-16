import React, { useState } from 'react';
import toast from 'react-hot-toast';
import Modal from './Modal';
import { crearUsuario } from '../api/usuarios';
import { ROLES } from '../constants';

export default function UsuarioFormModal({ onClose, onExito }) {
  const [form, setForm] = useState({
    UMG_Usuario: '',
    UMG_Contrasena: '',
    UMG_Nombre: '',
    UMG_Apellido: '',
    UMG_Rol_ID: ROLES[1].id,
  });
  const [guardando, setGuardando] = useState(false);

  const cambiar = (campo) => (e) => setForm((f) => ({ ...f, [campo]: e.target.value }));

  const guardar = async (e) => {
    e.preventDefault();
    if (!form.UMG_Usuario.trim() || !form.UMG_Nombre.trim() || !form.UMG_Apellido.trim()) {
      toast.error('Completa correo, nombre y apellido.');
      return;
    }
    if (form.UMG_Contrasena.length < 6) {
      toast.error('La contraseña debe tener al menos 6 caracteres.');
      return;
    }
    setGuardando(true);
    try {
      await crearUsuario({ ...form, UMG_Rol_ID: Number(form.UMG_Rol_ID) });
      toast.success('Usuario creado correctamente.');
      onExito();
    } catch (err) {
      toast.error(err?.response?.data?.mensaje || 'No se pudo crear el usuario.');
    } finally {
      setGuardando(false);
    }
  };

  return (
    <Modal titulo="Nuevo usuario" onClose={onClose} ancho="max-w-md">
      <form onSubmit={guardar} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Correo institucional</label>
          <input
            type="email"
            value={form.UMG_Usuario}
            onChange={cambiar('UMG_Usuario')}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Nombre</label>
            <input
              value={form.UMG_Nombre}
              onChange={cambiar('UMG_Nombre')}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Apellido</label>
            <input
              value={form.UMG_Apellido}
              onChange={cambiar('UMG_Apellido')}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Contraseña temporal</label>
          <input
            type="password"
            value={form.UMG_Contrasena}
            onChange={cambiar('UMG_Contrasena')}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Rol</label>
          <select
            value={form.UMG_Rol_ID}
            onChange={cambiar('UMG_Rol_ID')}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
          >
            {ROLES.map((r) => (
              <option key={r.id} value={r.id}>
                {r.nombre}
              </option>
            ))}
          </select>
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
            {guardando ? 'Creando...' : 'Crear usuario'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
