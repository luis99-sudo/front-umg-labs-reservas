import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { format, parseISO } from 'date-fns';
import { useAuth } from '../../context/AuthContext';
import { listarLogs } from '../../api/logs';

export default function Bitacora() {
  const { usuario } = useAuth();
  const [logs, setLogs] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    listarLogs(usuario.UMG_ID)
      .then(setLogs)
      .catch(() => toast.error('No se pudo cargar la bitácora.'))
      .finally(() => setCargando(false));
  }, [usuario.UMG_ID]);

  return (
    <div>
      <h1 className="font-display text-2xl text-slate-900 mb-1">Bitácora</h1>
      <p className="text-sm text-slate-500 mb-6">
        Historial inmutable de operaciones sobre el sistema (últimos 100 registros).
      </p>

      {cargando ? (
        <p className="text-sm text-slate-500">Cargando...</p>
      ) : (
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wide">
              <tr>
                <th className="text-left font-medium px-4 py-3">Fecha</th>
                <th className="text-left font-medium px-4 py-3">Acción</th>
                <th className="text-left font-medium px-4 py-3">Módulo</th>
                <th className="text-left font-medium px-4 py-3">Descripción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {logs.map((l) => (
                <tr key={l.umg_id}>
                  <td className="px-4 py-3 text-slate-500 text-xs whitespace-nowrap">
                    {format(parseISO(l.umg_fecha_registro), 'dd/MM/yyyy HH:mm')}
                  </td>
                  <td className="px-4 py-3 font-medium text-slate-800">{l.umg_accion}</td>
                  <td className="px-4 py-3 text-slate-600">{l.umg_modulo}</td>
                  <td className="px-4 py-3 text-slate-600">{l.umg_descripcion}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
