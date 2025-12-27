import { defineStore } from 'pinia';
import api from '../api/axios';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    token: localStorage.getItem('token') || null,
  }),
  actions: {
    async login(credentials) {
      try {
        // Endpoint /login sama untuk Central & Tenant (tergantung domain)
        const res = await api.post('/login', credentials);
        this.token = res.data.token;
        this.user = res.data.user;
        localStorage.setItem('token', this.token);
        return res.data;
      } catch (error) {
        throw error.response.data;
      }
    },
    logout() {
      this.token = null;
      this.user = null;
      localStorage.removeItem('token');
    }
  }
});