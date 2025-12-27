<template>
  <div class="space-y-6 p-4">
    <div class="border-b-2 border-black pb-4 flex justify-between items-end">
      <div>
        <h1 class="text-3xl font-bold uppercase tracking-tighter">Inventory</h1>
        <p class="text-sm text-gray-600">Add, edit, or remove store products.</p>
      </div>
      <button 
        @click="openModal()" 
        class="bg-black text-white px-4 py-2 text-sm font-bold uppercase hover:bg-gray-800 transition-colors"
      >
        + Add Product
      </button>
    </div>

    <div class="border-2 border-black overflow-hidden bg-white">
      <table class="w-full text-left border-collapse">
        <thead class="bg-gray-100 border-b-2 border-black font-bold uppercase text-sm">
          <tr>
            <th class="p-3 border-r border-black">Name</th>
            <th class="p-3 border-r border-black">Price</th>
            <th class="p-3 border-r border-black">Stock</th>
            <th class="p-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="product in products" :key="product.id" class="border-b border-black hover:bg-yellow-50">
            <td class="p-3 border-r border-black font-medium">{{ product.name }}</td>
            <td class="p-3 border-r border-black font-mono">Rp {{ formatNumber(product.price) }}</td>
            <td class="p-3 border-r border-black font-mono">{{ product.stock }}</td>
            <td class="p-3 space-x-2">
              <button @click="openModal(product)" class="underline font-bold text-blue-600">Edit</button>
              <button @click="deleteProduct(product.id)" class="underline font-bold text-red-600">Delete</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="isModalOpen" class="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div class="bg-white border-4 border-black p-6 w-full max-w-md shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
        <h2 class="text-xl font-bold uppercase mb-4">{{ editId ? 'Edit Product' : 'New Product' }}</h2>
        
        <form @submit.prevent="saveProduct" class="space-y-4">
          <div>
            <label class="block text-xs font-bold uppercase mb-1">Product Name</label>
            <input v-model="form.name" required class="w-full border-2 border-black p-2 focus:bg-yellow-50 outline-none" />
          </div>
          <div>
            <label class="block text-xs font-bold uppercase mb-1">Description</label>
            <textarea v-model="form.description" class="w-full border-2 border-black p-2 focus:bg-yellow-50 outline-none"></textarea>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-bold uppercase mb-1">Price</label>
              <input v-model.number="form.price" type="number" required class="w-full border-2 border-black p-2 focus:bg-yellow-50 outline-none" />
            </div>
            <div>
              <label class="block text-xs font-bold uppercase mb-1">Stock</label>
              <input v-model.number="form.stock" type="number" required class="w-full border-2 border-black p-2 focus:bg-yellow-50 outline-none" />
            </div>
          </div>
          
          <div class="flex gap-2 pt-4">
            <button type="submit" class="flex-1 bg-black text-white font-bold py-2 uppercase hover:bg-gray-800">Save</button>
            <button type="button" @click="isModalOpen = false" class="flex-1 border-2 border-black font-bold py-2 uppercase hover:bg-gray-100">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, reactive } from 'vue'
import api from '../../api/axios';

const products = ref([])
const isModalOpen = ref(false)
const editId = ref(null)
const form = reactive({ name: '', description: '', price: 0, stock: 0 })

const formatNumber = (val) => Number(val).toLocaleString('id-ID')

const fetchProducts = async () => {
  const res = await api.get('/products')
  products.value = res.data
}

const openModal = (product = null) => {
  if (product) {
    editId.value = product.id
    Object.assign(form, { ...product })
  } else {
    editId.value = null
    Object.assign(form, { name: '', description: '', price: 0, stock: 0 })
  }
  isModalOpen.value = true
}

const saveProduct = async () => {
  try {
    if (editId.value) {
      await api.put(`/products/${editId.value}`, form)
    } else {
      await api.post('/products', form)
    }
    isModalOpen.value = false
    fetchProducts()
  } catch (err) {
    alert("Error saving product")
  }
}

const deleteProduct = async (id) => {
  if (!confirm("Are you sure?")) return
  await api.delete(`/products/${id}`)
  fetchProducts()
}

onMounted(fetchProducts)
</script>