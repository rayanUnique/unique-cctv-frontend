import axios from 'axios';

const API_URL = 'http://localhost:8080/api/users';

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const userService = {
  async getAllUsers() {
    const response = await api.get('/');
    return response.data;
  },

  async getUserStats() {
    const response = await api.get('/stats');
    return response.data;
  },

  async updateUserRole(userId, role) {
    const response = await api.put(`/${userId}/role`, { role });
    return response.data;
  },

  async deleteUser(userId) {
    const response = await api.delete(`/${userId}`);
    return response.data;
  }
};