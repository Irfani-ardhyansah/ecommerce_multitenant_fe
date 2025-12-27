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
        const host = window.location.hostname;
        const isTenant = host !== 'localhost' && host !== '127.0.0.1';
        // Endpoint /login sama untuk Central & Tenant (tergantung domain)
        const url = isTenant ? '/login' : '/central/login';
        const res = await api.post(url, credentials);
        console.log(res)

        this.token = res.data.token;
        this.user = res.data.user;

        localStorage.setItem('token', this.token);
        localStorage.setItem('user', JSON.stringify(res.data.user));
        return res.data;
      } catch (error) {
        throw error.response.data;
      }
    },
    logout() {
      this.token = null;
      this.user = null;
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  }
});