/**
 * Centralized Route Paths Configuration
 * 
 * Changing any path here updates the corresponding URL everywhere across the application.
 */
export const ROUTES = {
  // Public Routes
  HOME: '/',

  // Admin Routes Root & Auth
  ADMIN: {
    ROOT: '/admin',
    LOGIN: '/admin/login',
    DASHBOARD: '/admin/dashboard',
    PRODUCTS: '/admin/products',
    ORDERS: '/admin/orders',
    CUSTOMERS: '/admin/customers',
    TESTIMONIALS: '/admin/testimonials',
    FAQS: '/admin/faqs',
    MESSAGES: '/admin/messages',
    CARD_DESIGNS: '/admin/card-designs',
    SETTINGS: '/admin/settings',
  },
};

/**
 * Returns relative path without leading slash/parent segment for nested React Router definitions.
 * Example: getSubPath('/admin/dashboard', '/admin') => 'dashboard'
 */
export function getSubPath(fullPath, parentPath = '/admin') {
  if (!fullPath.startsWith(parentPath)) return fullPath;
  const relative = fullPath.slice(parentPath.length);
  return relative.startsWith('/') ? relative.slice(1) : relative;
}

export default ROUTES;
