import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
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
        <Route path="/" element={<Home />} />

        {/* Admin Authentication */}
        <Route path="/admin/login" element={<AdminLogin />} />

        {/* Protected Admin SaaS Portal */}
        <Route path="/admin" element={<AdminRoute />}>
          <Route element={<AdminLayout />}>
            <Route index element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="products" element={<AdminProducts />} />
            <Route path="orders" element={<AdminOrders />} />
            <Route path="customers" element={<AdminCustomers />} />
            <Route path="testimonials" element={<AdminTestimonials />} />
            <Route path="faqs" element={<AdminFAQs />} />
            <Route path="messages" element={<AdminMessages />} />
            <Route path="card-designs" element={<AdminCardDesigns />} />
            <Route path="settings" element={<AdminSettings />} />
          </Route>
        </Route>

        {/* Catch-all fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
