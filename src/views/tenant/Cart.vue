<template>
  <div class="max-w-5xl mx-auto p-6 space-y-8">
    <header class="border-b border-slate-200 pb-6">
      <h1 class="text-3xl font-black text-slate-900 tracking-tight">Your Cart</h1>
      <p class="text-slate-500">Review your items before proceeding to checkout.</p>
    </header>

    <div v-if="cartItems.length > 0" class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div class="lg:col-span-2 space-y-4">
        <div v-for="item in cartItems" :key="item.id" class="bg-white border border-slate-200 rounded-2xl p-5 flex items-center justify-between gap-4 hover:border-blue-200 transition-colors">
          <div class="flex-1">
            <h3 class="font-bold text-slate-800 text-lg">{{ item.product.name }}</h3>
            <div class="text-xs text-slate-400 mt-1">
              Unit Price: <span class="font-bold text-slate-600">Rp {{ item.product.price.toLocaleString() }}</span>
            </div>
            <div class="text-[10px] text-orange-500 font-black uppercase mt-1">
              Stock Available: {{ item.product.stock }}
            </div>
          </div>

          <div class="flex items-center bg-slate-100 rounded-lg p-1">
            <button @click="updateQty(item, -1)" class="w-8 h-8 flex items-center justify-center hover:bg-white rounded-md transition-colors text-slate-600">-</button>
              <span class="w-10 text-center font-bold text-slate-800 text-sm">{{ item.quantity }}</span>
            <button @click="updateQty(item, 1)" class="w-8 h-8 flex items-center justify-center hover:bg-white rounded-md transition-colors text-slate-600">+</button>
          </div>

          <div class="text-right min-w-[120px]">
            <span class="text-[10px] font-bold text-slate-300 uppercase block">Subtotal</span>
            <p class="font-black text-blue-600 text-base">
              Rp {{ (item.product.price * item.quantity).toLocaleString() }}
            </p>
            <button @click="removeItem(item.id)" class="text-[10px] text-red-400 font-bold hover:text-red-600 uppercase mt-1">
              Remove
            </button>
          </div>
        </div>
      </div>

      <div class="lg:col-span-1">
        <div class="bg-slate-900 text-white rounded-3xl p-8 sticky top-24 shadow-2xl shadow-blue-100">
          <h2 class="text-xl font-black mb-6 border-b border-slate-700 pb-4">Order Summary</h2>
          
          <div class="space-y-4">
            <div class="flex justify-between text-slate-400 text-sm">
              <span>Total Items</span>
              <span class="text-white font-bold">{{ totalQuantity }}</span>
            </div>
            <div class="flex justify-between text-slate-400 text-sm">
              <span>Subtotal Cost</span>
              <span class="text-white font-bold">Rp {{ totalPrice.toLocaleString() }}</span>
            </div>
            <div class="flex justify-between text-slate-400 text-sm">
              <span>Tax (0%)</span>
              <span class="text-white font-bold">Rp 0</span>
            </div>
            
            <div class="pt-6 border-t border-slate-700 mt-6">
              <div class="flex justify-between items-end">
                <span class="text-sm text-slate-400 font-bold uppercase tracking-widest">Grand Total</span>
                <span class="text-2xl font-black text-blue-400">Rp {{ totalPrice.toLocaleString() }}</span>
              </div>
            </div>

            <button @click="handleCheckout" class="w-full mt-8 bg-blue-500 hover:bg-blue-400 text-white py-4 rounded-2xl font-black text-sm transition-all active:scale-95 shadow-lg shadow-blue-500/20 uppercase tracking-widest">
              Proceed to Checkout
            </button>
            
            <router-link to="/" class="block text-center mt-4 text-xs text-slate-500 hover:text-white transition-colors">
              Continue Shopping
            </router-link>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="text-center py-24 bg-white border border-dashed border-slate-300 rounded-3xl">

      <h2 class="text-xl font-bold text-slate-800">Your cart is empty</h2>
      <p class="text-slate-500 mt-2 mb-8">Looks like you haven't added anything yet.</p>
      <router-link to="/" class="bg-slate-900 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-600 transition-all">
        Start Shopping
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, computed } from 'vue';
import api from '../../api/axios';

const cartItems = ref([]);

// Kalkulasi Total Harga (Grand Total)
const totalPrice = computed(() => {
  return cartItems.value.reduce((acc, item) => {
    return acc + (item.product.price * item.quantity);
  }, 0);
});

// Kalkulasi Total Jumlah Barang
const totalQuantity = computed(() => {
  return cartItems.value.reduce((acc, item) => acc + item.quantity, 0);
});

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

  if (newQty < 1) {
    await removeItem(item.id);
    return;
  }

  try {
    await api.put(`/cart/${item.id}`, { quantity: newQty });
    await fetchCart();
  } catch (err) {
    alert(err.response?.data?.message || "Action failed");
  }
};

const removeItem = async (itemId) => {
  if (!confirm("Remove this item from your cart?")) return;
  try {
    await api.delete(`/cart/${itemId}`);
    await fetchCart();
  } catch (err) {
    alert("Failed to remove item");
  }
};

const handleCheckout = () => {
  alert("Checkout functionality would be implemented next. Total to pay: Rp " + totalPrice.value.toLocaleString());
  // Di sini biasanya Anda memanggil API POST /api/orders
};

onMounted(fetchCart);
</script>