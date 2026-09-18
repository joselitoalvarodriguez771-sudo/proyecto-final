import axios from 'axios';

const api = axios.create({
  baseURL: 'http://127.0.0.1:5000/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Servicios de Usuarios
export const getUsuarios = () => api.get('/usuarios');
export const updateEstadoUsuario = (id, estado) => api.put(`/usuarios/${id}/estado`, { estado });

export default api;