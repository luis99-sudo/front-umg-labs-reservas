import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function PrivateRoute({ children, soloAdmin = false }) {
  const { estaAutenticado, esAdmin } = useAuth();

  if (!estaAutenticado) {
    return <Navigate to="/" replace />;
  }

  if (soloAdmin && !esAdmin) {
    return <Navigate to="/docente/nueva-reserva" replace />;
  }

  return children;
}
