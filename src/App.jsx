import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './routes/PrivateRoute';
import DashboardLayout from './layouts/DashboardLayout';
import Login from './pages/Login';
import NuevaReserva from './pages/docente/NuevaReserva';
import MisReservas from './pages/docente/MisReservas';
import ReservasAdmin from './pages/admin/Reservas';
import Usuarios from './pages/admin/Usuarios';
import Laboratorios from './pages/admin/Laboratorios';
import Bloqueos from './pages/admin/Bloqueos';
import Bitacora from './pages/admin/Bitacora';

export default function App() {
  return (
    <AuthProvider>
      <Toaster position="top-right" toastOptions={{ duration: 4000 }} />
      <Routes>
        <Route path="/" element={<Login />} />

        <Route
          element={
            <PrivateRoute>
              <DashboardLayout />
            </PrivateRoute>
          }
        >
          <Route path="/docente/nueva-reserva" element={<NuevaReserva />} />
          <Route path="/docente/mis-reservas" element={<MisReservas />} />
        </Route>

        <Route
          element={
            <PrivateRoute soloAdmin>
              <DashboardLayout />
            </PrivateRoute>
          }
        >
          <Route path="/admin/reservas" element={<ReservasAdmin />} />
          <Route path="/admin/usuarios" element={<Usuarios />} />
          <Route path="/admin/laboratorios" element={<Laboratorios />} />
          <Route path="/admin/bloqueos" element={<Bloqueos />} />
          <Route path="/admin/bitacora" element={<Bitacora />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  );
}
