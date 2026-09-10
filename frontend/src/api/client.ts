import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || '';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

// Habits
export const habitsApi = {
  list: () => apiClient.get('/api/habits'),
  get: (id: number) => apiClient.get(`/api/habits/${id}`),
  create: (data: Record<string, unknown>) => apiClient.post('/api/habits', data),
  update: (id: number, data: Record<string, unknown>) => apiClient.put(`/api/habits/${id}`, data),
  delete: (id: number) => apiClient.delete(`/api/habits/${id}`),
  updateTags: (id: number, tagIds: number[]) => apiClient.put(`/api/habits/${id}/tags`, { tagIds }),
};

// Checkins
export const checkinsApi = {
  list: (params?: Record<string, string>) => apiClient.get('/api/checkins', { params }),
  create: (data: Record<string, unknown>) => apiClient.post('/api/checkins', data),
  update: (id: number, data: Record<string, unknown>) => apiClient.put(`/api/checkins/${id}`, data),
};

// Analytics
export const analyticsApi = {
  dashboard: () => apiClient.get('/api/analytics/dashboard'),
  progress: () => apiClient.get('/api/analytics/progress'),
};

// Reminders
export const remindersApi = {
  list: () => apiClient.get('/api/reminders'),
  create: (data: Record<string, unknown>) => apiClient.post('/api/reminders', data),
  update: (id: number, data: Record<string, unknown>) => apiClient.put(`/api/reminders/${id}`, data),
  delete: (id: number) => apiClient.delete(`/api/reminders/${id}`),
};

// Categories
export const categoriesApi = {
  list: () => apiClient.get('/api/categories'),
  create: (data: Record<string, unknown>) => apiClient.post('/api/categories', data),
  update: (id: number, data: Record<string, unknown>) => apiClient.put(`/api/categories/${id}`, data),
  delete: (id: number) => apiClient.delete(`/api/categories/${id}`),
};

// Tags
export const tagsApi = {
  list: () => apiClient.get('/api/tags'),
  create: (data: Record<string, unknown>) => apiClient.post('/api/tags', data),
  delete: (id: number) => apiClient.delete(`/api/tags/${id}`),
};

export default apiClient;