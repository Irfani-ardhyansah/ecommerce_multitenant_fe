<template>
  <div class="max-w-4xl mx-auto p-6">
    <h1 class="text-3xl font-bold mb-6">Shopping Cart</h1>

    <div v-if="cartItems.length > 0" class="bg-white shadow-md rounded-lg overflow-hidden">
      <table class="w-full text-left border-collapse">
        <thead class="bg-gray-50 border-b">
          <tr>
            <th class="p-4 font-semibold text-gray-700">Product</th>
            <th class="p-4 font-semibold text-gray-700 text-center">Quantity</th>
            <th class="p-4 font-semibold text-gray-700">Price</th>
            <th class="p-4 font-semibold text-gray-700">Action</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in cartItems" :key="item.id" class="border-b hover:bg-gray-50">
            <td class="p-4">
              <div class="font-bold text-gray-800">{{ item.product.name }}</div>
              <div class="text-sm text-gray-500">Stock: {{ item.product.stock }}</div>
            </td>
            <td class="p-4 text-center">
              <div class="flex items-center justify-center space-x-3">
                <button @click="updateQty(item, -1)" class="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300">-</button>
                <span class="font-medium">{{ item.quantity }}</span>
                <button @click="updateQty(item, 1)" class="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300">+</button>
              </div>
            </td>
            <td class="p-4 text-blue-600 font-bold">
              Rp {{ (item.product.price * item.quantity).toLocaleString() }}
            </td>
            <td class="p-4">
              <button @click="removeItem(item.id)" class="text-red-500 hover:text-red-700 font-medium">Remove</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-else class="text-center py-20 bg-gray-100 rounded-lg">
      <p class="text-gray-500 text-xl">Your cart is empty.</p>
      <router-link to="/" class="text-blue-500 underline mt-4 inline-block">Back to Shopping</router-link>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import api from '../../api/axios';

const cartItems = ref([]);

const fetchCart = async () => {
  try {
    const res = await api.get('/cart');
    cartItems.value = res.data.items || [];
  } catch (err) {
    console.error("Failed to fetch cart");
  }
};

const updateQty = async (item, change) => {
  const newQty = item.quantity + change;
  if (newQty < 1) return;

  try {
    // Menembak endpoint PUT /api/cart/{itemId}
    await api.put(`/cart/${item.id}`, { quantity: newQty });
    await fetchCart(); // Refresh data untuk sinkronisasi stok
  } catch (err) {
    alert(err.response?.data?.message || "Action failed");
  }
};

const removeItem = async (itemId) => {
  if (!confirm("Remove this item?")) return;
  try {
    await api.delete(`/cart/${itemId}`);
    await fetchCart();
  } catch (err) {
    alert("Failed to remove item");
  }
};

onMounted(fetchCart);
</script>