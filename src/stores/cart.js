import { defineStore } from 'pinia';
import api from '../api/axios';

export const useCartStore = defineStore('cart', {
  state: () => ({
    items: [],
    loading: false
  }),
  actions: {
    async fetchCart() {
      try {
        const res = await api.get('/cart');
        this.items = res.data.items || [];
      } catch (err) {
        this.items = [];
      }
    },
    async addToCart(productId, quantity = 1) {
      try {
        await api.post('/cart', { product_id: productId, quantity });
        await this.fetchCart();
      } catch (error) {
        throw error.response.data.message;
      }
    },
    async updateQty(itemId, quantity) {
      await api.put(`/cart/${itemId}`, { quantity });
      await this.fetchCart();
    },
    async removeFromCart(itemId) {
      await api.delete(`/cart/${itemId}`);
      await this.fetchCart();
    }
  }
});