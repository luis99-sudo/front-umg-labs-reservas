import React from 'react';
import Modal from './Modal';

export default function ConfirmDialog({
  titulo,
  mensaje,
  textoConfirmar = 'Confirmar',
  peligro = false,
  onConfirmar,
  onCancelar,
  cargando = false,
}) {
  return (
    <Modal titulo={titulo} onClose={onCancelar} ancho="max-w-sm">
      <p className="text-sm text-slate-600">{mensaje}</p>
      <div className="mt-5 flex justify-end gap-2">
        <button
          onClick={onCancelar}
          className="px-4 py-2 text-sm font-medium rounded-lg text-slate-700 hover:bg-slate-100"
        >
          Cancelar
        </button>
        <button
          onClick={onConfirmar}
          disabled={cargando}
          className={`px-4 py-2 text-sm font-medium rounded-lg text-white disabled:opacity-60 ${
            peligro ? 'bg-red-600 hover:bg-red-700' : 'bg-brand-700 hover:bg-brand-800'
          }`}
        >
          {cargando ? 'Procesando...' : textoConfirmar}
        </button>
      </div>
    </Modal>
  );
}
