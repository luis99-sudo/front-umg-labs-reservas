import React, { useEffect, useState, useCallback } from 'react';
import toast from 'react-hot-toast';
import { format, parseISO } from 'date-fns';
import { listarUsuarios, inactivarUsuario } from '../../api/usuarios';
import UsuarioFormModal from '../../components/UsuarioFormModal';
import ResetearContrasenaModal from '../../components/ResetearContrasenaModal';
import ConfirmDialog from '../../components/ConfirmDialog';

export default function Usuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [modalCrear, setModalCrear] = useState(false);
  const [porResetear, setPorResetear] = useState(null);
  const [porInactivar, setPorInactivar] = useState(null);
  const [inactivando, setInactivando] = useState(false);

  const cargar = useCallback(() => {
    setCargando(true);
    listarUsuarios()
      .then(setUsuarios)
      .catch(() => toast.error('No se pudieron cargar los usuarios.'))
      .finally(() => setCargando(false));
  }, []);

  useEffect(() => {
    cargar();
  }, [cargar]);

  const confirmarInactivar = async () => {
    setInactivando(true);
    try {
      await inactivarUsuario(porInactivar.UMG_ID);
      toast.success('Usuario inactivado.');
      setPorInactivar(null);
      cargar();
    } catch (err) {
      toast.error(err?.response?.data?.mensaje || 'No se pudo inactivar el usuario.');
    } finally {
      setInactivando(false);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl text-slate-900 mb-1">Usuarios</h1>
          <p className="text-sm text-slate-500">Docentes y administradores con acceso al sistema.</p>
        </div>
        <button
          onClick={() => setModalCrear(true)}
          className="rounded-lg bg-brand-700 text-white text-sm font-medium px-4 py-2.5 hover:bg-brand-800 transition"
        >
          + Nuevo usuario
        </button>
      </div>

      {cargando ? (
        <p className="text-sm text-slate-500">Cargando...</p>
      ) : (
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wide">
              <tr>
                <th className="text-left font-medium px-4 py-3">Nombre</th>
                <th className="text-left font-medium px-4 py-3">Correo</th>
                <th className="text-left font-medium px-4 py-3">Rol</th>
                <th className="text-left font-medium px-4 py-3">Estado</th>
                <th className="text-left font-medium px-4 py-3">Último acceso</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {usuarios.map((u) => (
                <tr key={u.UMG_ID}>
                  <td className="px-4 py-3 font-medium text-slate-800">
                    {u.UMG_Nombre} {u.UMG_Apellido}
                  </td>
                  <td className="px-4 py-3 text-slate-600">{u.UMG_Usuario}</td>
                  <td className="px-4 py-3 text-slate-600">{u.UMG_Rol_Nombre}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${
                        u.UMG_Estado === 1 ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      {u.UMG_Estado === 1 ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-500 text-xs">
                    {u.UMG_Ultimo_Acceso ? format(parseISO(u.UMG_Ultimo_Acceso), 'dd/MM/yyyy HH:mm') : '—'}
                  </td>
                  <td className="px-4 py-3 text-right space-x-3 whitespace-nowrap">
                    <button
                      onClick={() => setPorResetear(u)}
                      className="text-brand-700 hover:text-brand-900 text-sm font-medium"
                    >
                      Resetear contraseña
                    </button>
                    {u.UMG_Estado === 1 && (
                      <button
                        onClick={() => setPorInactivar(u)}
                        className="text-red-600 hover:text-red-800 text-sm font-medium"
                      >
                        Inactivar
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {modalCrear && (
        <UsuarioFormModal
          onClose={() => setModalCrear(false)}
          onExito={() => {
            setModalCrear(false);
            cargar();
          }}
        />
      )}
      {porResetear && (
        <ResetearContrasenaModal
          usuario={porResetear}
          onClose={() => setPorResetear(null)}
          onExito={() => {
            setPorResetear(null);
            cargar();
          }}
        />
      )}
      {porInactivar && (
        <ConfirmDialog
          titulo="Inactivar usuario"
          mensaje={`¿Inactivar a ${porInactivar.UMG_Nombre} ${porInactivar.UMG_Apellido}? No podrá iniciar sesión.`}
          textoConfirmar="Sí, inactivar"
          peligro
          cargando={inactivando}
          onConfirmar={confirmarInactivar}
          onCancelar={() => setPorInactivar(null)}
        />
      )}
    </div>
  );
}
