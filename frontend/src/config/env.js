/**
 * Centralized Environment & Base URL Configuration
 */
export const ENV = {
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api',
  SITE_URL: import.meta.env.VITE_SITE_URL || window.location.origin,
  IS_PRODUCTION: import.meta.env.PROD,
  IS_DEVELOPMENT: import.meta.env.DEV,
};

export default ENV;
