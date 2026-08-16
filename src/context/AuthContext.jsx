import React, { createContext, useContext, useState, useCallback } from 'react';
import { STORAGE_KEY } from '../api/api';

const AuthContext = createContext(null);

function leerUsuarioGuardado() {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(leerUsuarioGuardado);

  const iniciarSesion = useCallback((datos) => {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(datos));
    setUsuario(datos);
  }, []);

  // Para actualizaciones parciales (ej. limpiar RequiereCambioContrasena
  // después de que el usuario cambia su contraseña, sin tener que relogear).
  const actualizarUsuario = useCallback((parcial) => {
    setUsuario((prev) => {
      const nuevo = { ...prev, ...parcial };
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(nuevo));
      return nuevo;
    });
  }, []);

  const cerrarSesion = useCallback(() => {
    sessionStorage.removeItem(STORAGE_KEY);
    setUsuario(null);
  }, []);

  // El backend valida permisos comparando umg_rol.umg_nombre === 'Admin'
  // (texto exacto), así que el front replica esa misma condición aquí.
  const esAdmin = usuario?.UMG_Rol_Nombre === 'Admin';

  const value = {
    usuario,
    esAdmin,
    estaAutenticado: !!usuario,
    iniciarSesion,
    actualizarUsuario,
    cerrarSesion,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth debe usarse dentro de <AuthProvider>');
  return ctx;
}
