import React, { useEffect, useState, useCallback } from 'react';
import toast from 'react-hot-toast';
import { format, parseISO } from 'date-fns';
import { useAuth } from '../../context/AuthContext';
import { listarReservas, cancelarReserva } from '../../api/reservas';
import { ESTADOS_RESERVA } from '../../constants';
import ConfirmDialog from '../../components/ConfirmDialog';

export default function MisReservas() {
  const { usuario } = useAuth();
  const [reservas, setReservas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [porCancelar, setPorCancelar] = useState(null);
  const [cancelando, setCancelando] = useState(false);

  const cargar = useCallback(() => {
    setCargando(true);
    listarReservas({ userId: usuario.UMG_ID })
      .then(setReservas)
      .catch(() => toast.error('No se pudieron cargar tus reservas.'))
      .finally(() => setCargando(false));
  }, [usuario.UMG_ID]);

  useEffect(() => {
    cargar();
  }, [cargar]);

  const puedeCancelar = (r) => {
    if (r.UMG_Estado !== 'R') return false;
    const inicio = new Date(`${r.UMG_Fecha_Reserva}T${r.UMG_Hora_Inicio}`);
    return inicio > new Date();
  };

  const confirmarCancelacion = async () => {
    setCancelando(true);
    try {
      await cancelarReserva(porCancelar.UMG_ID);
      toast.success('Reserva cancelada.');
      setPorCancelar(null);
      cargar();
    } catch (err) {
      toast.error(err?.response?.data?.mensaje || 'No se pudo cancelar la reserva.');
    } finally {
      setCancelando(false);
    }
  };

  return (
    <div>
      <h1 className="font-display text-2xl text-slate-900 mb-1">Mis reservas</h1>
      <p className="text-sm text-slate-500 mb-6">Historial y estado de tus reservas de laboratorio.</p>

      {cargando ? (
        <p className="text-sm text-slate-500">Cargando...</p>
      ) : reservas.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center text-sm text-slate-500">
          Todavía no tienes reservas. Crea una desde "Nueva reserva".
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wide">
              <tr>
                <th className="text-left font-medium px-4 py-3">Laboratorio</th>
                <th className="text-left font-medium px-4 py-3">Fecha</th>
                <th className="text-left font-medium px-4 py-3">Horario</th>
                <th className="text-left font-medium px-4 py-3">Motivo</th>
                <th className="text-left font-medium px-4 py-3">Estado</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {reservas.map((r) => (
                <tr key={r.UMG_ID}>
                  <td className="px-4 py-3 font-medium text-slate-800">{r.UMG_Lab_Nombre}</td>
                  <td className="px-4 py-3 text-slate-600">{format(parseISO(r.UMG_Fecha_Reserva), 'dd/MM/yyyy')}</td>
                  <td className="px-4 py-3 text-slate-600">
                    {r.UMG_Hora_Inicio?.slice(0, 5)} – {r.UMG_Hora_Fin?.slice(0, 5)}
                  </td>
                  <td className="px-4 py-3 text-slate-600 max-w-xs truncate">{r.UMG_Motivo}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${ESTADOS_RESERVA[r.UMG_Estado]?.clase}`}
                    >
                      {ESTADOS_RESERVA[r.UMG_Estado]?.etiqueta}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    {puedeCancelar(r) && (
                      <button
                        onClick={() => setPorCancelar(r)}
                        className="text-red-600 hover:text-red-800 text-sm font-medium"
                      >
                        Cancelar
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {porCancelar && (
        <ConfirmDialog
          titulo="Cancelar reserva"
          mensaje={`¿Cancelar la reserva del ${format(parseISO(porCancelar.UMG_Fecha_Reserva), 'dd/MM/yyyy')} en ${porCancelar.UMG_Lab_Nombre}?`}
          textoConfirmar="Sí, cancelar"
          peligro
          cargando={cancelando}
          onConfirmar={confirmarCancelacion}
          onCancelar={() => setPorCancelar(null)}
        />
      )}
    </div>
  );
}
