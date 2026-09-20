import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { authService } from '../../services/api';
import { ROUTES } from '../../routes/paths';

export default function AdminRoute() {
  const isAuth = authService.isAuthenticated();

  if (!isAuth) {
    return <Navigate to={ROUTES.ADMIN.LOGIN} replace />;
  }

  return <Outlet />;
}
