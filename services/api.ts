import axios from 'axios';
import { storage } from '../utils/storage';

const API_BASE_URL = 'http://170.81.121.86:4000/api';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Adicionar token nas requisições se disponível
api.interceptors.request.use(
  async (config) => {
    const token = await storage.getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Tratar erros de resposta
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // TODO: Tratar não autorizado - limpar token e redirecionar para login
      console.log('Não autorizado - redirecionando para login');
    }
    return Promise.reject(error);
  }
);

export default api;
