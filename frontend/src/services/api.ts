import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authApi = {
  login: async (email: string, password: string) => {
    const response = await apiClient.post('/auth/login', { email, password });
    return response.data;
  },
  signup: async (email: string, password: string) => {
    const response = await apiClient.post('/auth/signup', { email, password });
    return response.data;
  },
};

export const generationApi = {
  create: async (
    prompt: string,
    style: string,
    imageFile?: File,
    signal?: AbortSignal
  ) => {
    const formData = new FormData();
    formData.append('prompt', prompt);
    formData.append('style', style);
    if (imageFile) {
      formData.append('imageUpload', imageFile);
    }
    const response = await apiClient.post('/generations', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      signal,
    });
    return response.data;
  },
  getRecent: async (limit: number = 5) => {
    const response = await apiClient.get(`/generations?limit=${limit}`);
    return response.data;
  },
};

export default apiClient;

