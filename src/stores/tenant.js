import { defineStore } from 'pinia';
import api from '../api/axios';

export const useTenantStore = defineStore('tenant', {
  state: () => ({
    tenants: [],
    loading: false
  }),
  actions: {
    async fetchTenants() {
      this.loading = true;
      try {
        const res = await api.get('/central/tenants');
        this.tenants = res.data.data;
      } finally {
        this.loading = false;
      }
    },
    async createTenant(payload) {
      // payload: { id, domain, email, password }
      const res = await api.post('/central/tenants', payload);
      await this.fetchTenants();
      return res.data;
    },
    async deleteTenant(id) {
      await api.delete(`/central/tenants/${id}`);
      await this.fetchTenants();
    }
  }
});