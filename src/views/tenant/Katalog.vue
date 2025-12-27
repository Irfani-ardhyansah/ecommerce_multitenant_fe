<template>
  <div class="p-4">
    <div v-if="!isTenant" class="min-h-[60vh] flex flex-col items-center justify-center text-center space-y-4">
      <div class="border-4 border-black p-8 bg-yellow-300 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
        <h1 class="text-4xl font-black uppercase tracking-tighter">Central Hub</h1>
        <p class="font-mono text-sm mt-2">Platform Management System Active.</p>
      </div>
      <p class="text-gray-500 max-w-xs">Please visit a tenant subdomain to view the product catalog.</p>
    </div>

    <div v-else class="space-y-6">
      <div class="border-b-2 border-black pb-4">
        <h1 class="text-3xl font-bold tracking-tight text-black italic uppercase">Store Catalog</h1>
        <p class="text-sm text-gray-600 mt-1">Viewing products for this specific store.</p>
        
        <div class="mt-4 flex gap-2">
          <input
            v-model="keyword"
            placeholder="Search products..."
            class="border border-gray-400 px-2 py-1 text-sm focus:outline-none focus:border-black flex-1"
          />
          <div class="border border-black px-2 py-1 text-sm font-mono bg-gray-50 flex items-center">
            ITEMS: {{ filteredProducts.length }}
          </div>
          <router-link 
            v-if="auth.token"
            to="/cart" 
            class="border-2 border-black px-4 py-1 text-sm font-bold bg-black text-white hover:bg-gray-800 transition-colors"
          >
            CART ({{ cartStore.items.length }})
          </router-link>
        </div>
      </div>

      <div v-if="loading" class="space-y-4">
        <div v-for="i in 3" :key="i" class="h-32 bg-gray-100 animate-pulse border border-gray-200" />
      </div>

      <div v-else-if="error" class="p-8 text-center border-2 border-red-200 bg-red-50">
        <p class="text-red-600 font-medium">Failed to load products</p>
        <button @click="fetchProducts" class="mt-2 underline text-sm">Try Again</button>
      </div>

      <div v-else class="space-y-1">
        <div
          v-for="product in filteredProducts"
          :key="product.id"
          class="border border-black bg-white mb-6 group shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
        >
          <div class="p-4 border-b border-black flex justify-between items-start">
            <div class="space-y-1">
              <h3 class="text-xl font-bold uppercase">{{ product.name }}</h3>
              <p class="text-sm italic text-gray-700">{{ product.description }}</p>
            </div>
            <span v-if="product.stock <= 5 && product.stock > 0" class="text-[10px] font-bold border border-black px-1 bg-orange-400">
              LOW
            </span>
          </div>

          <div class="grid grid-cols-2 border-b border-black bg-gray-50/50">
            <div class="p-2 border-r border-black">
              <span class="block text-[10px] text-gray-500 uppercase font-bold tracking-widest">Price</span>
              <p class="text-lg font-bold">Rp {{ formatNumber(product.price) }}</p>
            </div>
            <div class="p-2 text-right">
              <span class="block text-[10px] text-gray-500 uppercase font-bold tracking-widest">Stock</span>
              <p :class="['text-lg font-mono font-bold', product.stock <= 0 ? 'text-red-500' : '']">
                {{ product.stock }}
              </p>
            </div>
          </div>

          <div class="p-2 bg-white">
            <button
              v-if="auth.token"
              @click="handleAddToCart(product)"
              :disabled="product.stock <= 0 || adding === product.id"
              class="w-full py-2 font-bold uppercase tracking-widest transition-colors border-2 border-black"
              :class="product.stock > 0 
                ? 'bg-yellow-400 text-black hover:bg-black hover:text-white' 
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'"
            >
              {{ adding === product.id ? '...' : (product.stock > 0 ? 'Add to Cart' : 'Out of Stock') }}
            </button>
            <router-link v-else to="/login" class="block text-center text-blue-600 underline text-sm font-bold p-2">
              Sign in to buy
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import api from '../../api/axios'
import { useAuthStore } from '../../stores/auth'
import { useCartStore } from '../../stores/cart'

const auth = useAuthStore()
const cartStore = useCartStore()

const products = ref([])
const loading = ref(true)
const error = ref(false)
const keyword = ref('')
const adding = ref(null)

// LOGIC DETEKSI DOMAIN
const isTenant = computed(() => {
  const host = window.location.hostname;
  return host !== 'localhost' && host !== '127.0.0.1';
});

const formatNumber = (val) => {
  return Number(val).toLocaleString('id-ID', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })
}

const filteredProducts = computed(() => {
  if (!keyword.value) return products.value
  return products.value.filter(p =>
    p.name.toLowerCase().includes(keyword.value.toLowerCase())
  )
})

const fetchProducts = async () => {
  // JANGAN JALANKAN API JIKA BUKAN TENANT
  if (!isTenant.value) {
    loading.value = false;
    return;
  }

  loading.value = true
  error.value = false
  try {
    const res = await api.get('/products')
    products.value = res.data
    
    // Ambil isi cart jika user sudah login
    if (auth.token) {
      await cartStore.fetchCart()
    }
  } catch (err) {
    console.error("Fetch Error:", err)
    error.value = true
  } finally {
    loading.value = false
  }
}

const handleAddToCart = async (product) => {
  if (product.stock <= 0) return
  adding.value = product.id
  product.stock--

  try {
    await cartStore.addToCart(product.id, 1)
  } catch (err) {
    product.stock++
    alert("Gagal menambahkan ke keranjang.")
  } finally {
    adding.value = null
  }
}

onMounted(fetchProducts)
</script>