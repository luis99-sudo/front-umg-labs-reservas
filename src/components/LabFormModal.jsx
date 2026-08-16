import React, { useState } from 'react';
import toast from 'react-hot-toast';
import Modal from './Modal';
import { crearLab, editarLab } from '../api/labs';

export default function LabFormModal({ lab, onClose, onExito }) {
  const esEdicion = !!lab;
  const [nombre, setNombre] = useState(lab?.UMG_Nombre || '');
  const [activo, setActivo] = useState(lab ? lab.UMG_Estado === 1 : true);
  const [guardando, setGuardando] = useState(false);

  const guardar = async (e) => {
    e.preventDefault();
    if (!nombre.trim()) {
      toast.error('El nombre del laboratorio es obligatorio.');
      return;
    }
    setGuardando(true);
    try {
      if (esEdicion) {
        await editarLab(lab.UMG_ID, { UMG_Nombre: nombre.trim(), UMG_Estado: activo ? 1 : 0 });
        toast.success('Laboratorio actualizado.');
      } else {
        await crearLab(nombre.trim());
        toast.success('Laboratorio creado.');
      }
      onExito();
    } catch (err) {
      toast.error(err?.response?.data?.mensaje || 'No se pudo guardar el laboratorio.');
    } finally {
      setGuardando(false);
    }
  };

  return (
    <Modal titulo={esEdicion ? 'Editar laboratorio' : 'Nuevo laboratorio'} onClose={onClose} ancho="max-w-sm">
      <form onSubmit={guardar} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Nombre</label>
          <input
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            maxLength={30}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
            placeholder="Ej. Laboratorio de Redes"
          />
        </div>
        {esEdicion && (
          <label className="flex items-center gap-2 text-sm text-slate-700">
            <input
              type="checkbox"
              checked={activo}
              onChange={(e) => setActivo(e.target.checked)}
              className="rounded border-slate-300"
            />
            Laboratorio activo
          </label>
        )}
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
            {guardando ? 'Guardando...' : 'Guardar'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
