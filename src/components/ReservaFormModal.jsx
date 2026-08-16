import React, { useEffect, useState, useCallback } from 'react';
import DatePicker from 'react-datepicker';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import Modal from './Modal';
import HorarioGrid from './HorarioGrid';
import { listarReservas, modificarReserva } from '../api/reservas';
import { listarCondiciones } from '../api/condiciones';

function idxDesdeHora(horaStr) {
  const [h, m] = horaStr.slice(0, 5).split(':').map(Number);
  return (h * 60 + m) / 30;
}

function horaDesdeIdx(idx) {
  const totalMin = idx * 30;
  const h = String(Math.floor(totalMin / 60)).padStart(2, '0');
  const m = String(totalMin % 60).padStart(2, '0');
  return `${h}:${m}`;
}

export default function ReservaFormModal({ reserva, labs, onClose, onExito }) {
  const [labId, setLabId] = useState(String(reserva.UMG_Lab_ID));
  const [fecha, setFecha] = useState(new Date(`${reserva.UMG_Fecha_Reserva}T00:00:00`));
  const [motivo, setMotivo] = useState(reserva.UMG_Motivo);
  const [seleccion, setSeleccion] = useState({
    inicioIdx: idxDesdeHora(reserva.UMG_Hora_Inicio),
    finIdx: idxDesdeHora(reserva.UMG_Hora_Fin) - 1,
  });
  const [reservasDia, setReservasDia] = useState([]);
  const [condicionesDia, setCondicionesDia] = useState([]);
  const [cargandoGrid, setCargandoGrid] = useState(false);
  const [guardando, setGuardando] = useState(false);

  const fechaStr = format(fecha, 'yyyy-MM-dd');

  const cargarGrid = useCallback(() => {
    setCargandoGrid(true);
    Promise.all([listarReservas({ labId, fecha: fechaStr }), listarCondiciones()])
      .then(([reservasResp, condicionesResp]) => {
        setReservasDia(reservasResp.filter((r) => r.UMG_Estado === 'R' && r.UMG_ID !== reserva.UMG_ID));
        setCondicionesDia(
          condicionesResp.filter(
            (c) =>
              c.UMG_Estado === 1 &&
              c.UMG_Fecha === fechaStr &&
              (c.UMG_Lab_ID === null || String(c.UMG_Lab_ID) === String(labId))
          )
        );
      })
      .catch(() => toast.error('No se pudo cargar la disponibilidad.'))
      .finally(() => setCargandoGrid(false));
  }, [labId, fechaStr, reserva.UMG_ID]);

  useEffect(() => {
    cargarGrid();
  }, [cargarGrid]);

  const guardar = async (e) => {
    e.preventDefault();
    if (seleccion.inicioIdx === null) {
      toast.error('Selecciona un rango de horario.');
      return;
    }
    if (!motivo.trim()) {
      toast.error('El motivo es obligatorio.');
      return;
    }
    setGuardando(true);
    try {
      await modificarReserva(reserva.UMG_ID, {
        UMG_User_ID: reserva.UMG_User_ID,
        UMG_Lab_ID: Number(labId),
        UMG_Fecha_Reserva: fechaStr,
        UMG_Hora_Inicio: horaDesdeIdx(seleccion.inicioIdx),
        UMG_Hora_Fin: horaDesdeIdx(seleccion.finIdx + 1),
        UMG_Motivo: motivo.trim(),
      });
      toast.success('Reserva actualizada.');
      onExito();
    } catch (err) {
      toast.error(err?.response?.data?.mensaje || 'No se pudo actualizar la reserva.');
    } finally {
      setGuardando(false);
    }
  };

  return (
    <Modal titulo={`Editar reserva de ${reserva.UMG_Docente_Nombre}`} onClose={onClose} ancho="max-w-3xl">
      <form onSubmit={guardar} className="space-y-4">
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Fecha</label>
            <DatePicker
              selected={fecha}
              onChange={setFecha}
              minDate={new Date()}
              dateFormat="dd/MM/yyyy"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-600"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Laboratorio</label>
            <select
              value={labId}
              onChange={(e) => setLabId(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
            >
              {labs.map((l) => (
                <option key={l.UMG_ID} value={l.UMG_ID}>
                  {l.UMG_Nombre}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <p className="text-sm font-medium text-slate-700 mb-2">Horario</p>
          {cargandoGrid ? (
            <p className="text-sm text-slate-500">Cargando disponibilidad...</p>
          ) : (
            <HorarioGrid
              reservas={reservasDia}
              condiciones={condicionesDia}
              seleccion={seleccion}
              onSeleccionChange={setSeleccion}
            />
          )}
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
            {guardando ? 'Guardando...' : 'Guardar cambios'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
