import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import Modal from './Modal';
import { crearCondicion, editarCondicion } from '../api/condiciones';
import { TIPOS_CONDICION } from '../constants';

export default function CondicionFormModal({ condicion, labs, onClose, onExito }) {
  const esEdicion = !!condicion;
  const [labId, setLabId] = useState(condicion?.UMG_Lab_ID ? String(condicion.UMG_Lab_ID) : '');
  const [fecha, setFecha] = useState(condicion ? new Date(`${condicion.UMG_Fecha}T00:00:00`) : new Date());
  const [horaInicio, setHoraInicio] = useState(condicion?.UMG_Hora_Inicio?.slice(0, 5) || '07:00');
  const [horaFin, setHoraFin] = useState(condicion?.UMG_Hora_Fin?.slice(0, 5) || '22:00');
  const [tipo, setTipo] = useState(condicion?.UMG_Tipo || TIPOS_CONDICION[0]);
  const [motivo, setMotivo] = useState(condicion?.UMG_Motivo || '');
  const [guardando, setGuardando] = useState(false);

  const guardar = async (e) => {
    e.preventDefault();
    if (!motivo.trim()) {
      toast.error('El motivo del bloqueo es obligatorio.');
      return;
    }
    if (horaInicio >= horaFin) {
      toast.error('La hora de inicio debe ser menor a la hora de fin.');
      return;
    }
    const datos = {
      UMG_Lab_ID: labId ? Number(labId) : null,
      UMG_Fecha: format(fecha, 'yyyy-MM-dd'),
      UMG_Hora_Inicio: horaInicio,
      UMG_Hora_Fin: horaFin,
      UMG_Tipo: tipo,
      UMG_Motivo: motivo.trim(),
    };
    setGuardando(true);
    try {
      if (esEdicion) {
        await editarCondicion(condicion.UMG_ID, { ...datos, UMG_Estado: 1 });
        toast.success('Bloqueo actualizado.');
      } else {
        await crearCondicion(datos);
        toast.success('Bloqueo creado.');
      }
      onExito();
    } catch (err) {
      toast.error(err?.response?.data?.mensaje || 'No se pudo guardar el bloqueo.');
    } finally {
      setGuardando(false);
    }
  };

  return (
    <Modal titulo={esEdicion ? 'Editar bloqueo' : 'Nuevo bloqueo'} onClose={onClose} ancho="max-w-md">
      <form onSubmit={guardar} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Laboratorio</label>
          <select
            value={labId}
            onChange={(e) => setLabId(e.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
          >
            <option value="">Todos los laboratorios</option>
            {labs.map((l) => (
              <option key={l.UMG_ID} value={l.UMG_ID}>
                {l.UMG_Nombre}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Fecha</label>
          <DatePicker
            selected={fecha}
            onChange={setFecha}
            minDate={new Date()}
            dateFormat="dd/MM/yyyy"
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Hora inicio</label>
            <input
              type="time"
              value={horaInicio}
              onChange={(e) => setHoraInicio(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Hora fin</label>
            <input
              type="time"
              value={horaFin}
              onChange={(e) => setHoraFin(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Tipo</label>
          <select
            value={tipo}
            onChange={(e) => setTipo(e.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
          >
            {TIPOS_CONDICION.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Motivo</label>
          <textarea
            value={motivo}
            onChange={(e) => setMotivo(e.target.value)}
            rows={2}
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
            {guardando ? 'Guardando...' : 'Guardar'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
