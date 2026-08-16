import React, { useMemo } from 'react';
import toast from 'react-hot-toast';
import { HORA_HABIL_INICIO, HORA_HABIL_FIN, DURACION_MAXIMA_MINUTOS } from '../constants';

const SLOT_MINUTOS = 30;
const TOTAL_SLOTS = (24 * 60) / SLOT_MINUTOS; // 48 franjas: 00:00 a 23:30
const MAX_SLOTS_SELECCION = DURACION_MAXIMA_MINUTOS / SLOT_MINUTOS;

// Acepta "HH:MM" o "HH:MM:SS" (así vienen las horas del serializer de DRF).
function minutosDesdeHora(horaStr) {
  const [h, m] = horaStr.split(':').map(Number);
  return h * 60 + m;
}

function formatearSlot(indice) {
  const totalMin = indice * SLOT_MINUTOS;
  const h = String(Math.floor(totalMin / 60)).padStart(2, '0');
  const m = String(totalMin % 60).padStart(2, '0');
  return `${h}:${m}`;
}

export default function HorarioGrid({ reservas = [], condiciones = [], seleccion, onSeleccionChange, deshabilitado = false }) {
  const habilInicioMin = minutosDesdeHora(HORA_HABIL_INICIO);
  const habilFinMin = minutosDesdeHora(HORA_HABIL_FIN);

  const estadoSlots = useMemo(() => {
    const bloqueos = [
      ...reservas.map((r) => ({
        inicio: minutosDesdeHora(r.UMG_Hora_Inicio),
        fin: minutosDesdeHora(r.UMG_Hora_Fin),
        motivo: `Reservado — ${r.UMG_Docente_Nombre}`,
      })),
      ...condiciones.map((c) => ({
        inicio: minutosDesdeHora(c.UMG_Hora_Inicio),
        fin: minutosDesdeHora(c.UMG_Hora_Fin),
        motivo: `${c.UMG_Tipo}: ${c.UMG_Motivo}`,
      })),
    ];

    return Array.from({ length: TOTAL_SLOTS }, (_, idx) => {
      const inicioSlot = idx * SLOT_MINUTOS;
      const finSlot = inicioSlot + SLOT_MINUTOS;

      if (inicioSlot < habilInicioMin || finSlot > habilFinMin) {
        return { estado: 'fuera', motivo: 'Fuera de horario hábil (07:00–22:00)' };
      }

      const choque = bloqueos.find((b) => b.inicio < finSlot && b.fin > inicioSlot);
      if (choque) {
        return { estado: 'ocupado', motivo: choque.motivo };
      }

      return { estado: 'disponible', motivo: null };
    });
  }, [reservas, condiciones, habilInicioMin, habilFinMin]);

  const manejarClic = (idx) => {
    if (deshabilitado || estadoSlots[idx].estado !== 'disponible') return;

    if (seleccion.inicioIdx === null) {
      onSeleccionChange({ inicioIdx: idx, finIdx: idx });
      return;
    }

    if (idx === seleccion.inicioIdx && seleccion.finIdx === seleccion.inicioIdx) {
      onSeleccionChange({ inicioIdx: null, finIdx: null });
      return;
    }

    const nuevoInicio = Math.min(seleccion.inicioIdx, idx);
    const nuevoFin = Math.max(seleccion.inicioIdx, idx);

    if (nuevoFin - nuevoInicio + 1 > MAX_SLOTS_SELECCION) {
      toast.error('La reserva no puede superar 4 horas continuas.');
      return;
    }

    for (let i = nuevoInicio; i <= nuevoFin; i += 1) {
      if (estadoSlots[i].estado !== 'disponible') {
        toast.error('El rango elegido cruza un horario no disponible.');
        return;
      }
    }

    onSeleccionChange({ inicioIdx: nuevoInicio, finIdx: nuevoFin });
  };

  const claseSlot = (idx) => {
    const { estado } = estadoSlots[idx];
    const enSeleccion = seleccion.inicioIdx !== null && idx >= seleccion.inicioIdx && idx <= seleccion.finIdx;

    if (enSeleccion) return 'bg-green-600 border-green-600 text-white';
    if (estado === 'ocupado') return 'bg-red-50 border-red-200 text-red-700 cursor-not-allowed';
    if (estado === 'fuera') return 'bg-slate-100 border-slate-100 text-slate-400 cursor-not-allowed';
    return 'bg-white border-slate-200 text-slate-700 hover:border-brand-500 hover:text-brand-700 cursor-pointer';
  };

  return (
    <div>
      <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-1.5">
        {Array.from({ length: TOTAL_SLOTS }, (_, idx) => (
          <button
            key={idx}
            type="button"
            title={estadoSlots[idx].motivo || undefined}
            onClick={() => manejarClic(idx)}
            disabled={deshabilitado}
            className={`text-xs font-medium rounded-lg border py-2 transition ${claseSlot(idx)}`}
          >
            {formatearSlot(idx)}
          </button>
        ))}
      </div>
      <div className="flex flex-wrap gap-4 mt-4 text-xs text-slate-500">
        <span className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded bg-white border border-slate-200 inline-block" /> Disponible
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded bg-red-50 border border-red-200 inline-block" /> Ocupado / bloqueado
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded bg-slate-100 border border-slate-100 inline-block" /> Fuera de horario hábil
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded bg-green-600 inline-block" /> Tu selección
        </span>
      </div>
    </div>
  );
}
