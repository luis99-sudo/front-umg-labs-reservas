import React, { useEffect, useState, useCallback } from 'react';
import toast from 'react-hot-toast';
import { format, parseISO } from 'date-fns';
import { listarReservas, cancelarReserva } from '../../api/reservas';
import { listarLabs } from '../../api/labs';
import { listarUsuarios } from '../../api/usuarios';
import { ESTADOS_RESERVA } from '../../constants';
import ConfirmDialog from '../../components/ConfirmDialog';
import ReservaFormModal from '../../components/ReservaFormModal';

export default function ReservasAdmin() {
  const [reservas, setReservas] = useState([]);
  const [labs, setLabs] = useState([]);
  const [docentes, setDocentes] = useState([]);
  const [filtros, setFiltros] = useState({ labId: '', fecha: '', userId: '' });
  const [cargando, setCargando] = useState(true);
  const [porCancelar, setPorCancelar] = useState(null);
  const [cancelando, setCancelando] = useState(false);
  const [porEditar, setPorEditar] = useState(null);

  useEffect(() => {
    listarLabs().then(setLabs).catch(() => {});
    listarUsuarios()
      .then((data) => setDocentes(data.filter((u) => u.UMG_Rol_Nombre === 'Docente')))
      .catch(() => {});
  }, []);

  const cargar = useCallback(() => {
    setCargando(true);
    const activos = {};
    if (filtros.labId) activos.labId = filtros.labId;
    if (filtros.fecha) activos.fecha = filtros.fecha;
    if (filtros.userId) activos.userId = filtros.userId;
    listarReservas(activos)
      .then(setReservas)
      .catch(() => toast.error('No se pudieron cargar las reservas.'))
      .finally(() => setCargando(false));
  }, [filtros]);

  useEffect(() => {
    cargar();
  }, [cargar]);

  const puedeAccionar = (r) => {
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
      <h1 className="font-display text-2xl text-slate-900 mb-1">Reservas</h1>
      <p className="text-sm text-slate-500 mb-6">Listado completo de reservas registradas por los docentes.</p>

      <div className="bg-white border border-slate-200 rounded-2xl p-4 mb-5 grid sm:grid-cols-3 gap-3">
        <select
          value={filtros.labId}
          onChange={(e) => setFiltros((f) => ({ ...f, labId: e.target.value }))}
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
        >
          <option value="">Todos los laboratorios</option>
          {labs.map((l) => (
            <option key={l.UMG_ID} value={l.UMG_ID}>
              {l.UMG_Nombre}
            </option>
          ))}
        </select>
        <input
          type="date"
          value={filtros.fecha}
          onChange={(e) => setFiltros((f) => ({ ...f, fecha: e.target.value }))}
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
        />
        <select
          value={filtros.userId}
          onChange={(e) => setFiltros((f) => ({ ...f, userId: e.target.value }))}
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
        >
          <option value="">Todos los docentes</option>
          {docentes.map((d) => (
            <option key={d.UMG_ID} value={d.UMG_ID}>
              {d.UMG_Nombre} {d.UMG_Apellido}
            </option>
          ))}
        </select>
      </div>

      {cargando ? (
        <p className="text-sm text-slate-500">Cargando...</p>
      ) : reservas.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center text-sm text-slate-500">
          No hay reservas con estos filtros.
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wide">
              <tr>
                <th className="text-left font-medium px-4 py-3">Docente</th>
                <th className="text-left font-medium px-4 py-3">Laboratorio</th>
                <th className="text-left font-medium px-4 py-3">Fecha</th>
                <th className="text-left font-medium px-4 py-3">Horario</th>
                <th className="text-left font-medium px-4 py-3">Estado</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {reservas.map((r) => (
                <tr key={r.UMG_ID}>
                  <td className="px-4 py-3">
                    <p className="font-medium text-slate-800">{r.UMG_Docente_Nombre}</p>
                    <p className="text-xs text-slate-400">{r.UMG_Docente_Correo}</p>
                  </td>
                  <td className="px-4 py-3 text-slate-600">{r.UMG_Lab_Nombre}</td>
                  <td className="px-4 py-3 text-slate-600">{format(parseISO(r.UMG_Fecha_Reserva), 'dd/MM/yyyy')}</td>
                  <td className="px-4 py-3 text-slate-600">
                    {r.UMG_Hora_Inicio?.slice(0, 5)} – {r.UMG_Hora_Fin?.slice(0, 5)}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${ESTADOS_RESERVA[r.UMG_Estado]?.clase}`}
                    >
                      {ESTADOS_RESERVA[r.UMG_Estado]?.etiqueta}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right space-x-3 whitespace-nowrap">
                    {puedeAccionar(r) && (
                      <button
                        onClick={() => setPorEditar(r)}
                        className="text-brand-700 hover:text-brand-900 text-sm font-medium"
                      >
                        Editar
                      </button>
                    )}
                    {puedeAccionar(r) && (
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
          mensaje={`¿Cancelar la reserva de ${porCancelar.UMG_Docente_Nombre} del ${format(parseISO(porCancelar.UMG_Fecha_Reserva), 'dd/MM/yyyy')}?`}
          textoConfirmar="Sí, cancelar"
          peligro
          cargando={cancelando}
          onConfirmar={confirmarCancelacion}
          onCancelar={() => setPorCancelar(null)}
        />
      )}

      {porEditar && (
        <ReservaFormModal
          reserva={porEditar}
          labs={labs}
          onClose={() => setPorEditar(null)}
          onExito={() => {
            setPorEditar(null);
            cargar();
          }}
        />
      )}
    </div>
  );
}
