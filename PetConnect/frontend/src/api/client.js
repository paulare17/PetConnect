import axios from 'axios';

// Vite usa VITE_ com a prefix, no REACT_APP_
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
});

// Attach access token to requests when present
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: if 401, try to refresh the access token using refresh token
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (!originalRequest) return Promise.reject(error);

    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refresh = localStorage.getItem('refresh');
      if (refresh) {
        try {
          const resp = await axios.post(
            `${API_BASE}/token/refresh/`,
            { refresh },
            { headers: { 'Content-Type': 'application/json' } }
          );
          const newAccess = resp.data.access;
          localStorage.setItem('access', newAccess);
          originalRequest.headers.Authorization = `Bearer ${newAccess}`;
          return api(originalRequest);
        } catch (refreshErr) {
          // refresh failed -> clear stored credentials
          localStorage.removeItem('access');
          localStorage.removeItem('refresh');
          localStorage.removeItem('user');
          return Promise.reject(refreshErr);
        }
      }
    }
    return Promise.reject(error);
  }
);

// ============================================
// API Functions
// ============================================

// Autenticació
export const login = async (credentials) => {
  // Validació client: ha d’enviar username i password com JSON
  if (!credentials?.username || !credentials?.password) {
    return Promise.reject({
      response: { status: 400, data: { detail: 'Cal username i password' } }
    });
  }
  try {
    const res = await api.post('/usuarios/login/', {
      username: credentials.username,
      password: credentials.password,
    });
    // Desa tokens i usuari
    const { access, refresh, user } = res.data || {};
    if (access) localStorage.setItem('access', access);
    if (refresh) localStorage.setItem('refresh', refresh);
    if (user) localStorage.setItem('user', JSON.stringify(user));
    return res;
  } catch (err) {
    // Log detallat per veure el missatge del backend (clau per al 400)
    console.error('Login error payload:', err?.response?.data);
    throw err;
  }
};
export const register = (userData) => api.post('/usuarios/', userData);

// Usuari actual
export const getCurrentUser = () => api.get('/usuarios/me/');

// Perfil Usuari
export const getUserProfile = () => api.get('/perfil-usuario/');
export const createUserProfile = (profileData) => {
  const formData = new FormData();
  Object.keys(profileData).forEach(key => {
    if (profileData[key] !== null && profileData[key] !== undefined) {
      if (Array.isArray(profileData[key])) {
        formData.append(key, JSON.stringify(profileData[key]));
      } else {
        formData.append(key, profileData[key]);
      }
    }
  });
  return api.post('/perfil-usuario/', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
};
export const updateUserProfile = (id, profileData) => {
  const formData = new FormData();
  Object.keys(profileData).forEach(key => {
    if (profileData[key] !== null && profileData[key] !== undefined) {
      if (Array.isArray(profileData[key])) {
        formData.append(key, JSON.stringify(profileData[key]));
      } else {
        formData.append(key, profileData[key]);
      }
    }
  });
  return api.patch(`/perfil-usuario/${id}/`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
};

// Perfil Protectora
export const getProtectoraProfile = () => api.get('/perfil-protectora/');
export const createProtectoraProfile = (profileData) => {
  const formData = new FormData();
  Object.keys(profileData).forEach(key => {
    if (profileData[key] !== null && profileData[key] !== undefined) {
      if (Array.isArray(profileData[key])) {
        formData.append(key, JSON.stringify(profileData[key]));
      } else {
        formData.append(key, profileData[key]);
      }
    }
  });
  return api.post('/perfil-protectora/', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
};
export const updateProtectoraProfile = (id, profileData) => {
  const formData = new FormData();
  Object.keys(profileData).forEach(key => {
    if (profileData[key] !== null && profileData[key] !== undefined) {
      if (Array.isArray(profileData[key])) {
        formData.append(key, JSON.stringify(profileData[key]));
      } else {
        formData.append(key, profileData[key]);
      }
    }
  });
  return api.patch(`/perfil-protectora/${id}/`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
};

export default api;
