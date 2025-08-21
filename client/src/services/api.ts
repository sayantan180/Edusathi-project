import axios from 'axios';

const API_BASE_URL = 'http://localhost:3001/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token') || localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Token expired, redirect to login
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      localStorage.removeItem('userProfile');
      localStorage.removeItem('isLoggedIn');
      const role = localStorage.getItem('userRole') || '';
      localStorage.removeItem('userRole');
      const authPath = role ? `/auth?role=${role}` : '/auth';
      window.location.href = authPath;
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (data: { name: string; email: string; password: string; role?: string }) =>
    api.post('/auth/register', data),
  
  login: (data: { email: string; password: string }) =>
    api.post('/auth/login', data),
  
  getProfile: () =>
    api.get('/auth/profile'),
  
  updateAvatar: (formData: FormData) =>
    api.put('/auth/avatar', formData),
};

// Content API
export const contentAPI = {
  create: (formData: FormData) =>
    api.post('/content', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }),
  
  getMyContents: () =>
    api.get('/content/my'),

  getById: (id: string) =>
    api.get(`/content/${id}`),
  
  update: (id: string, data: any) =>
    api.put(`/content/${id}`, data),
  
  delete: (id: string) =>
    api.delete(`/content/${id}`),
  
  assignToBusiness: (id: string, businessId: string) =>
    api.put(`/content/${id}/assign`, { businessId }),
};

// Business API
export const businessAPI = {
  getAll: () =>
    api.get('/businesses'),
  
  create: (data: any) =>
    api.post('/businesses', data),
};

// Sales API
export const salesAPI = {
  getMySales: () =>
    api.get('/sales/my'),
  
  getContentSales: (contentId: string) =>
    api.get(`/sales/content/${contentId}`),
};

export default api;
