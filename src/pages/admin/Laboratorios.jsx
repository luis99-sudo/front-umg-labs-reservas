import React, { useEffect, useState, useCallback } from 'react';
import toast from 'react-hot-toast';
import { listarLabs } from '../../api/labs';
import LabFormModal from '../../components/LabFormModal';

export default function Laboratorios() {
  const [labs, setLabs] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [modal, setModal] = useState(null); // null | 'nuevo' | lab

  const cargar = useCallback(() => {
    setCargando(true);
    listarLabs()
      .then(setLabs)
      .catch(() => toast.error('No se pudieron cargar los laboratorios.'))
      .finally(() => setCargando(false));
  }, []);

  useEffect(() => {
    cargar();
  }, [cargar]);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl text-slate-900 mb-1">Laboratorios</h1>
          <p className="text-sm text-slate-500">Espacios disponibles para reserva.</p>
        </div>
        <button
          onClick={() => setModal('nuevo')}
          className="rounded-lg bg-brand-700 text-white text-sm font-medium px-4 py-2.5 hover:bg-brand-800 transition"
        >
          + Nuevo laboratorio
        </button>
      </div>

      {cargando ? (
        <p className="text-sm text-slate-500">Cargando...</p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {labs.map((lab) => (
            <div key={lab.UMG_ID} className="bg-white border border-slate-200 rounded-2xl p-5">
              <div className="flex items-start justify-between">
                <h3 className="font-display text-base text-slate-900">{lab.UMG_Nombre}</h3>
                <span
                  className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${
                    lab.UMG_Estado === 1 ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'
                  }`}
                >
                  {lab.UMG_Estado === 1 ? 'Activo' : 'Inactivo'}
                </span>
              </div>
              <button
                onClick={() => setModal(lab)}
                className="mt-4 text-sm font-medium text-brand-700 hover:text-brand-900"
              >
                Editar
              </button>
            </div>
          ))}
        </div>
      )}

      {modal && (
        <LabFormModal
          lab={modal === 'nuevo' ? null : modal}
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
