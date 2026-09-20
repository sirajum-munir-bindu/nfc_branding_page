import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ROUTES, getSubPath } from './routes/paths';
import Home from './pages/Home';
import AdminLogin from './admin/pages/AdminLogin';
import AdminRoute from './admin/components/AdminRoute';
import AdminLayout from './admin/components/AdminLayout';
import AdminDashboard from './admin/pages/AdminDashboard';
import AdminProducts from './admin/pages/AdminProducts';
import AdminOrders from './admin/pages/AdminOrders';
import AdminCustomers from './admin/pages/AdminCustomers';
import AdminTestimonials from './admin/pages/AdminTestimonials';
import AdminFAQs from './admin/pages/AdminFAQs';
import AdminMessages from './admin/pages/AdminMessages';
import AdminCardDesigns from './admin/pages/AdminCardDesigns';
import AdminSettings from './admin/pages/AdminSettings';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Landing Page */}
        <Route path={ROUTES.HOME} element={<Home />} />

        {/* Admin Authentication */}
        <Route path={ROUTES.ADMIN.LOGIN} element={<AdminLogin />} />

        {/* Protected Admin SaaS Portal */}
        <Route path={ROUTES.ADMIN.ROOT} element={<AdminRoute />}>
          <Route element={<AdminLayout />}>
            <Route index element={<Navigate to={ROUTES.ADMIN.DASHBOARD} replace />} />
            <Route path={getSubPath(ROUTES.ADMIN.DASHBOARD, ROUTES.ADMIN.ROOT)} element={<AdminDashboard />} />
            <Route path={getSubPath(ROUTES.ADMIN.PRODUCTS, ROUTES.ADMIN.ROOT)} element={<AdminProducts />} />
            <Route path={getSubPath(ROUTES.ADMIN.ORDERS, ROUTES.ADMIN.ROOT)} element={<AdminOrders />} />
            <Route path={getSubPath(ROUTES.ADMIN.CUSTOMERS, ROUTES.ADMIN.ROOT)} element={<AdminCustomers />} />
            <Route path={getSubPath(ROUTES.ADMIN.TESTIMONIALS, ROUTES.ADMIN.ROOT)} element={<AdminTestimonials />} />
            <Route path={getSubPath(ROUTES.ADMIN.FAQS, ROUTES.ADMIN.ROOT)} element={<AdminFAQs />} />
            <Route path={getSubPath(ROUTES.ADMIN.MESSAGES, ROUTES.ADMIN.ROOT)} element={<AdminMessages />} />
            <Route path={getSubPath(ROUTES.ADMIN.CARD_DESIGNS, ROUTES.ADMIN.ROOT)} element={<AdminCardDesigns />} />
            <Route path={getSubPath(ROUTES.ADMIN.SETTINGS, ROUTES.ADMIN.ROOT)} element={<AdminSettings />} />
          </Route>
        </Route>

        {/* Catch-all fallback */}
        <Route path="*" element={<Navigate to={ROUTES.HOME} replace />} />
      </Routes>
    </BrowserRouter>
  );
}
