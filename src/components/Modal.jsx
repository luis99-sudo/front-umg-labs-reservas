import React from 'react';
import { X } from 'lucide-react';

export default function Modal({ titulo, onClose, children, ocultarCierre = false, ancho = 'max-w-lg' }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 px-4">
      <div className={`w-full ${ancho} bg-white rounded-2xl shadow-xl max-h-[90vh] overflow-y-auto`}>
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200">
          <h2 className="font-display text-lg text-slate-900">{titulo}</h2>
          {!ocultarCierre && (
            <button onClick={onClose} className="text-slate-400 hover:text-slate-600" aria-label="Cerrar">
              <X size={20} />
            </button>
          )}
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}
