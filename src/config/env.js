/**
 * Centralized Environment Configuration
 */
export const ENV = {
  API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || '/api',
  SITE_URL: process.env.NEXT_PUBLIC_SITE_URL || (typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000'),
  IS_PRODUCTION: process.env.NODE_ENV === 'production',
  IS_DEVELOPMENT: process.env.NODE_ENV === 'development',
};

export default ENV;
