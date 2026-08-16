import React, { useEffect, useState, useCallback } from 'react';
import DatePicker, { registerLocale } from 'react-datepicker';
import { es } from 'date-fns/locale';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import 'react-datepicker/dist/react-datepicker.css';
import { useAuth } from '../../context/AuthContext';
import { listarLabs } from '../../api/labs';
import { listarReservas, crearReserva } from '../../api/reservas';
import { listarCondiciones } from '../../api/condiciones';
import HorarioGrid from '../../components/HorarioGrid';

registerLocale('es', es);

function formatoHora(idx) {
  const totalMin = idx * 30;
  const h = String(Math.floor(totalMin / 60)).padStart(2, '0');
  const m = String(totalMin % 60).padStart(2, '0');
  return `${h}:${m}`;
}

export default function NuevaReserva() {
  const { usuario } = useAuth();
  const [labs, setLabs] = useState([]);
  const [labId, setLabId] = useState('');
  const [fecha, setFecha] = useState(new Date());
  const [reservasDia, setReservasDia] = useState([]);
  const [condicionesDia, setCondicionesDia] = useState([]);
  const [seleccion, setSeleccion] = useState({ inicioIdx: null, finIdx: null });
  const [motivo, setMotivo] = useState('');
  const [cargandoGrid, setCargandoGrid] = useState(false);
  const [enviando, setEnviando] = useState(false);

  useEffect(() => {
    listarLabs()
      .then((data) => {
        const activos = data.filter((l) => l.UMG_Estado === 1);
        setLabs(activos);
        if (activos.length > 0) setLabId(String(activos[0].UMG_ID));
      })
      .catch(() => toast.error('No se pudieron cargar los laboratorios.'));
  }, []);

  const fechaStr = format(fecha, 'yyyy-MM-dd');

  const cargarDisponibilidad = useCallback(() => {
    if (!labId) return;
    setCargandoGrid(true);
    setSeleccion({ inicioIdx: null, finIdx: null });
    Promise.all([listarReservas({ labId, fecha: fechaStr }), listarCondiciones()])
      .then(([reservas, condiciones]) => {
        setReservasDia(reservas.filter((r) => r.UMG_Estado === 'R'));
        setCondicionesDia(
          condiciones.filter(
            (c) =>
              c.UMG_Estado === 1 &&
              c.UMG_Fecha === fechaStr &&
              (c.UMG_Lab_ID === null || String(c.UMG_Lab_ID) === String(labId))
          )
        );
      })
      .catch(() => toast.error('No se pudo cargar la disponibilidad del laboratorio.'))
      .finally(() => setCargandoGrid(false));
  }, [labId, fechaStr]);

  useEffect(() => {
    cargarDisponibilidad();
  }, [cargarDisponibilidad]);

  const horaInicioSel = seleccion.inicioIdx !== null ? formatoHora(seleccion.inicioIdx) : null;
  const horaFinSel = seleccion.finIdx !== null ? formatoHora(seleccion.finIdx + 1) : null;

  const enviarReserva = async (e) => {
    e.preventDefault();
    if (seleccion.inicioIdx === null) {
      toast.error('Selecciona un rango de horario en la grilla.');
      return;
    }
    if (!motivo.trim()) {
      toast.error('Indica el motivo de la reserva.');
      return;
    }
    setEnviando(true);
    try {
      await crearReserva({
        UMG_User_ID: usuario.UMG_ID,
        UMG_Lab_ID: Number(labId),
        UMG_Fecha_Reserva: fechaStr,
        UMG_Hora_Inicio: horaInicioSel,
        UMG_Hora_Fin: horaFinSel,
        UMG_Motivo: motivo.trim(),
      });
      toast.success('Reserva creada correctamente.');
      setMotivo('');
      cargarDisponibilidad();
    } catch (err) {
      toast.error(err?.response?.data?.mensaje || 'No se pudo crear la reserva.');
      cargarDisponibilidad();
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="max-w-4xl">
      <h1 className="font-display text-2xl text-slate-900 mb-1">Nueva reserva</h1>
      <p className="text-sm text-slate-500 mb-6">
        Elige fecha y laboratorio, luego selecciona tu rango de horario en la grilla.
      </p>

      <div className="bg-white border border-slate-200 rounded-2xl p-5 mb-5 grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Fecha</label>
          <DatePicker
            selected={fecha}
            onChange={setFecha}
            minDate={new Date()}
            locale="es"
            dateFormat="dd/MM/yyyy"
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-600"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Laboratorio</label>
          <select
            value={labId}
            onChange={(e) => setLabId(e.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-600"
          >
            {labs.map((lab) => (
              <option key={lab.UMG_ID} value={lab.UMG_ID}>
                {lab.UMG_Nombre}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl p-5 mb-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-base text-slate-900">Horario del {format(fecha, 'dd/MM/yyyy')}</h2>
          {seleccion.inicioIdx !== null && (
            <span className="text-sm font-medium text-green-700">
              {horaInicioSel} – {horaFinSel}
            </span>
          )}
        </div>
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

      <form onSubmit={enviarReserva} className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Motivo</label>
          <textarea
            value={motivo}
            onChange={(e) => setMotivo(e.target.value)}
            rows={3}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-600"
            placeholder="Ej. Práctica de laboratorio de Redes I"
          />
        </div>
        <button
          type="submit"
          disabled={enviando}
          className="rounded-lg bg-brand-700 text-white text-sm font-medium px-5 py-2.5 hover:bg-brand-800 transition disabled:opacity-60"
        >
          {enviando ? 'Reservando...' : 'Confirmar reserva'}
        </button>
      </form>
    </div>
  );
}
