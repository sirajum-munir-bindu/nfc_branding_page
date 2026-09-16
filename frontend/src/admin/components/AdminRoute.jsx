import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { authService } from '../../services/api';

export default function AdminRoute() {
  const isAuth = authService.isAuthenticated();

  if (!isAuth) {
    return <Navigate to="/admin/login" replace />;

  }

  return <Outlet />;
}
