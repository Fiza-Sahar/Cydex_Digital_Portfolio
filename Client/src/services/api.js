import axios from 'axios';

/**
 * Resolves and normalizes the API base URL cleanly:
 * - Strips any trailing slashes to prevent double slashes.
 * - If VITE_API_URL is just the domain (e.g. https://cydex-digital-portfolio-r37p.vercel.app),
 *   it automatically appends /api/v1.
 * - Handles relative /api/v1 fallback in local proxy setups.
 */
export const getApiBaseUrl = () => {
  const envUrl = (import.meta.env.VITE_API_URL || '').trim();

  if (!envUrl) {
    return '/api/v1';
  }

  // Remove trailing slashes
  let cleanUrl = envUrl.replace(/\/+$/, '');

  // If the user provided the domain without /api or /api/v1, append /api/v1
  if (!cleanUrl.endsWith('/api/v1')) {
    if (cleanUrl.endsWith('/api')) {
      cleanUrl = `${cleanUrl}/v1`;
    } else if (!cleanUrl.includes('/api/')) {
      cleanUrl = `${cleanUrl}/api/v1`;
    }
  }

  return cleanUrl;
};

const api = axios.create({
  baseURL: getApiBaseUrl(),
  withCredentials: true, // Send and receive HttpOnly cookies cross-domain
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor: attach token as Bearer header if stored locally as fallback
api.interceptors.request.use(
  (config) => {
    try {
      const token = localStorage.getItem('cydex_token');
      if (token && !config.headers.Authorization) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (e) {
      // localStorage may be disabled in some environments
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for centralized error handling
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const customError = {
      message: error.response?.data?.message || error.message || 'An unexpected error occurred',
      errors: error.response?.data?.errors || [],
      status: error.response?.status,
    };
    return Promise.reject(customError);
  }
);

export default api;
