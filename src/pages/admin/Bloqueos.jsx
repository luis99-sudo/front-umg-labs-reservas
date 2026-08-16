import React, { useEffect, useState, useCallback } from 'react';
import toast from 'react-hot-toast';
import { format, parseISO } from 'date-fns';
import { listarCondiciones } from '../../api/condiciones';
import { listarLabs } from '../../api/labs';
import CondicionFormModal from '../../components/CondicionFormModal';

export default function Bloqueos() {
  const [condiciones, setCondiciones] = useState([]);
  const [labs, setLabs] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [modal, setModal] = useState(null);

  const cargar = useCallback(() => {
    setCargando(true);
    listarCondiciones()
      .then(setCondiciones)
      .catch(() => toast.error('No se pudieron cargar los bloqueos.'))
      .finally(() => setCargando(false));
  }, []);

  useEffect(() => {
    cargar();
    listarLabs().then(setLabs).catch(() => {});
  }, [cargar]);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl text-slate-900 mb-1">Bloqueos</h1>
          <p className="text-sm text-slate-500">
            Mantenimientos, asuetos y actividades que restringen la disponibilidad.
          </p>
        </div>
        <button
          onClick={() => setModal('nuevo')}
          className="rounded-lg bg-brand-700 text-white text-sm font-medium px-4 py-2.5 hover:bg-brand-800 transition"
        >
          + Nuevo bloqueo
        </button>
      </div>

      {cargando ? (
        <p className="text-sm text-slate-500">Cargando...</p>
      ) : condiciones.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center text-sm text-slate-500">
          No hay bloqueos registrados.
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wide">
              <tr>
                <th className="text-left font-medium px-4 py-3">Tipo</th>
                <th className="text-left font-medium px-4 py-3">Laboratorio</th>
                <th className="text-left font-medium px-4 py-3">Fecha</th>
                <th className="text-left font-medium px-4 py-3">Horario</th>
                <th className="text-left font-medium px-4 py-3">Motivo</th>
                <th className="text-left font-medium px-4 py-3">Estado</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {condiciones.map((c) => (
                <tr key={c.UMG_ID}>
                  <td className="px-4 py-3 font-medium text-slate-800">{c.UMG_Tipo}</td>
                  <td className="px-4 py-3 text-slate-600">{c.UMG_Lab_Nombre}</td>
                  <td className="px-4 py-3 text-slate-600">{format(parseISO(c.UMG_Fecha), 'dd/MM/yyyy')}</td>
                  <td className="px-4 py-3 text-slate-600">
                    {c.UMG_Hora_Inicio?.slice(0, 5)} – {c.UMG_Hora_Fin?.slice(0, 5)}
                  </td>
                  <td className="px-4 py-3 text-slate-600 max-w-xs truncate">{c.UMG_Motivo}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${
                        c.UMG_Estado === 1 ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      {c.UMG_Estado === 1 ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => setModal(c)}
                      className="text-brand-700 hover:text-brand-900 text-sm font-medium"
                    >
                      Editar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {modal && (
        <CondicionFormModal
          condicion={modal === 'nuevo' ? null : modal}
          labs={labs}
          onClose={() => setModal(null)}
          onExito={() => {
            setModal(null);
            cargar();
          }}
        />
      )}
    </div>
  );
}
