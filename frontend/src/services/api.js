import axios from 'axios';
import { ENV } from '../config/env';
import { ROUTES } from '../routes/paths';

const API_BASE_URL = ENV.API_BASE_URL;

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('tapcard_access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = localStorage.getItem('tapcard_refresh_token');
      if (refreshToken) {
        try {
          const res = await axios.post(`${API_BASE_URL}/auth/refresh/`, {
            refresh: refreshToken,
          });
          const newAccess = res.data.access;
          localStorage.setItem('tapcard_access_token', newAccess);
          originalRequest.headers.Authorization = `Bearer ${newAccess}`;
          return api(originalRequest);
        } catch (refreshError) {
          localStorage.removeItem('tapcard_access_token');
          localStorage.removeItem('tapcard_refresh_token');
          localStorage.removeItem('tapcard_user');
          if (window.location.pathname.startsWith(ROUTES.ADMIN.ROOT) && window.location.pathname !== ROUTES.ADMIN.LOGIN) {
            window.location.href = ROUTES.ADMIN.LOGIN;
          }
        }
      }
    }
    return Promise.reject(error);
  }
);

export const authService = {
  login: async (email, password) => {
    const res = await api.post('/auth/login/', { email, password });
    if (res.data.tokens) {
      localStorage.setItem('tapcard_access_token', res.data.tokens.access);
      localStorage.setItem('tapcard_refresh_token', res.data.tokens.refresh);
      localStorage.setItem('tapcard_user', JSON.stringify(res.data.user));
    }
    return res.data;
  },
  logout: () => {
    localStorage.removeItem('tapcard_access_token');
    localStorage.removeItem('tapcard_refresh_token');
    localStorage.removeItem('tapcard_user');
  },
  getCurrentUser: () => {
    const userStr = localStorage.getItem('tapcard_user');
    return userStr ? JSON.parse(userStr) : null;
  },
  isAuthenticated: () => {
    return !!localStorage.getItem('tapcard_access_token');
  },
  getMe: () => api.get('/auth/me/'),
};

export const productService = {
  getProducts: () => api.get('/products/'),
  getProduct: (id) => api.get(`/products/${id}/`),
  createProduct: (data) => api.post('/products/', data),
  updateProduct: (id, data) => api.patch(`/products/${id}/`, data),
  deleteProduct: (id) => api.delete(`/products/${id}/`),
};

export const cardDesignService = {
  getCardDesigns: () => api.get('/card-designs/'),
  createCardDesign: (data) => api.post('/card-designs/', data),
  updateCardDesign: (id, data) => api.patch(`/card-designs/${id}/`, data),
  deleteCardDesign: (id) => api.delete(`/card-designs/${id}/`),
};

export const orderService = {
  createOrder: (orderData) => api.post('/orders/', orderData),
  getOrders: (params) => api.get('/orders/', { params }),
  getOrder: (id) => api.get(`/orders/${id}/`),
  updateOrder: (id, data) => api.patch(`/orders/${id}/`, data),
  deleteOrder: (id) => api.delete(`/orders/${id}/`),
};

export const testimonialService = {
  getTestimonials: () => api.get('/testimonials/'),
  createTestimonial: (data) => api.post('/testimonials/', data),
  updateTestimonial: (id, data) => api.patch(`/testimonials/${id}/`, data),
  deleteTestimonial: (id) => api.delete(`/testimonials/${id}/`),
};

export const faqService = {
  getFAQs: () => api.get('/faqs/'),
  createFAQ: (data) => api.post('/faqs/', data),
  updateFAQ: (id, data) => api.patch(`/faqs/${id}/`, data),
  deleteFAQ: (id) => api.delete(`/faqs/${id}/`),
};

export const contactService = {
  sendMessage: (data) => api.post('/contact/', data),
  getMessages: () => api.get('/contact/'),
  markRead: (id) => api.post(`/contact/${id}/mark_read/`),
  deleteMessage: (id) => api.delete(`/contact/${id}/`),
};

export const adminService = {
  getDashboardStats: () => api.get('/admin/dashboard/'),
  getCustomers: (params) => api.get('/admin/customers/', { params }),
  deleteCustomer: (id) => api.delete(`/admin/customers/${id}/`),
};

export const settingsService = {
  getSettings: () => api.get('/settings/'),
  updateSetting: (key, value) => api.post('/settings/', { key, value }),
};

export default api;
