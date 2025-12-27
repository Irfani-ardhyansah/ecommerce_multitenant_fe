<template>
  <div class="space-y-8">
    <!-- Header -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6">
      <div>
        <h1 class="text-2xl font-black text-slate-800 tracking-tight">
          Product Catalog
        </h1>
        <p class="text-sm text-slate-500">
          Manage your store products and inventory levels.
        </p>
      </div>

      <div class="flex items-center gap-3">
        <input
          v-model="keyword"
          placeholder="Search products..."
          class="px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <div class="bg-white px-4 py-2 rounded-lg border border-slate-200 shadow-sm">
          <span class="text-xs font-bold text-slate-400 uppercase mr-2">
            Items
          </span>
          <span class="font-bold text-blue-600">
            {{ filteredProducts.length }}
          </span>
        </div>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div
        v-for="i in 4"
        :key="i"
        class="h-48 bg-slate-100 animate-pulse rounded-xl"
      />
    </div>

    <!-- Error -->
    <div
      v-else-if="error"
      class="text-center py-16 bg-red-50 border border-red-200 rounded-xl"
    >
      <p class="text-red-600 font-bold">Failed to load products</p>
      <button
        @click="fetchProducts"
        class="mt-4 text-sm font-bold text-red-600 hover:underline"
      >
        Retry
      </button>
    </div>

    <!-- Empty -->
    <div
      v-else-if="filteredProducts.length === 0"
      class="text-center py-16 bg-slate-50 border border-slate-200 rounded-xl"
    >
      <p class="font-bold text-gray-600">No products found</p>
      <p class="text-sm text-slate-400 mt-1">
        Try adjusting your search keyword.
      </p>
    </div>

    <!-- Products -->
    <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div
        v-for="product in filteredProducts"
        :key="product.id"
        class="bg-white border border-slate-200 rounded-xl p-5 flex flex-col hover:shadow-xl transition-all group"
      >
        <div class="space-y-2">
          <div class="flex justify-between items-start">
            <h3 class="font-bold text-slate-800 group-hover:text-blue-600">
              {{ product.name }}
            </h3>

            <span
              v-if="product.stock <= 5 && product.stock > 0"
              class="text-[9px] bg-orange-100 text-orange-600 px-1.5 py-0.5 rounded font-black uppercase"
            >
              Low
            </span>
          </div>

          <p class="text-xs text-slate-400 line-clamp-2 italic">
            {{ product.description || 'No description.' }}
          </p>
        </div>

        <div class="my-6 pt-4 border-t">
          <div class="flex justify-between items-end">
            <div>
              <span class="text-[10px] font-bold text-slate-300 uppercase">
                Price
              </span>
              <p class="text-lg font-black">
                Rp {{ product.price.toLocaleString() }}
              </p>
            </div>

            <div class="text-right">
              <span class="text-[10px] font-bold text-slate-300 uppercase">
                Stock
              </span>
              <p
                :class="product.stock > 0 ? 'text-gray-600' : 'text-red-500'"
                class="font-bold text-sm"
              >
                {{ product.stock }}
              </p>
            </div>
          </div>
        </div>

        <button
          v-if="auth.token"
          @click="handleAddToCart(product)"
          :disabled="product.stock <= 0 || adding === product.id"
          class="mt-auto w-full py-2.5 rounded-lg text-xs font-bold transition"
          :class="product.stock > 0
            ? 'bg-slate-900 text-white hover:bg-blue-600'
            : 'bg-slate-100 text-slate-400 cursor-not-allowed'"
        >
          {{ adding === product.id ? 'Adding...' : product.stock > 0 ? 'Add to Cart' : 'Out of Stock' }}
        </button>

        <router-link
          v-else
          to="/login"
          class="mt-auto block text-center py-2.5 bg-slate-50 text-blue-600 rounded-lg text-xs font-bold hover:bg-blue-50"
        >
          Sign in to buy
        </router-link>
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

const filteredProducts = computed(() => {
  return products.value.filter(p =>
    p.name.toLowerCase().includes(keyword.value.toLowerCase())
  )
})

const fetchProducts = async () => {
  loading.value = true
  error.value = false
  try {
    const res = await api.get('/products')
    products.value = res.data
  } catch {
    error.value = true
  } finally {
    loading.value = false
  }
}

const handleAddToCart = async (product) => {
  adding.value = product.id

  // optimistic update
  product.stock--

  try {
    await cartStore.addToCart(product.id, 1)
  } catch {
    product.stock++
  } finally {
    adding.value = null
  }
}

onMounted(fetchProducts)
</script>
