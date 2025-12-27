<template>
  <div class="space-y-6 p-4">
    <div class="border-b-2 border-black pb-4 flex justify-between items-end">
      <div>
        <h1 class="text-3xl font-bold uppercase tracking-tighter italic">Platform Control</h1>
        <p class="text-sm text-gray-600 font-mono">Centralized Database & Tenant Infrastructure</p>
      </div>
      <button 
        @click="openModal()" 
        class="bg-emerald-500 text-black border-2 border-black px-4 py-2 text-sm font-bold uppercase hover:bg-emerald-400 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-none transition-all"
      >
        + Deploy New Tenant
      </button>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-for="tenant in tenants" :key="tenant.id" 
           class="border-2 border-black bg-white p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] group">
        <div class="flex justify-between items-start mb-4">
          <div class="w-10 h-10 bg-black text-white flex items-center justify-center font-black">
            {{ tenant.id.charAt(0).toUpperCase() }}
          </div>
          <span class="text-[10px] font-bold border border-black px-2 bg-gray-100 uppercase">Active</span>
        </div>
        
        <h3 class="text-xl font-black uppercase mb-1">{{ tenant.id }}</h3>
        <p class="text-xs font-mono text-gray-500 mb-4 border-b border-gray-200 pb-2">
          DB: tenant_{{ tenant.id }}
        </p>

        <div class="space-y-2 mb-6">
          <div class="flex justify-between text-xs">
            <span class="text-gray-400 uppercase font-bold">Primary Domain</span>
            <a :href="`http://${tenant.domains[0]?.domain}:5173`" target="_blank" class="text-blue-600 underline font-bold">
              {{ tenant.domains[0]?.domain }}
            </a>
          </div>
        </div>

        <button 
          @click="deleteTenant(tenant.id)" 
          class="w-full border-2 border-black py-1 text-xs font-bold uppercase hover:bg-red-500 hover:text-white transition-colors"
        >
          Terminate Tenant
        </button>
      </div>
    </div>

    <div v-if="isModalOpen" class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div class="bg-white border-4 border-black p-8 w-full max-w-lg shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]">
        <h2 class="text-2xl font-black uppercase mb-6 tracking-tighter">Tenant Configuration</h2>
        
        <form @submit.prevent="deployTenant" class="space-y-4">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-[10px] font-black uppercase mb-1">Tenant ID (Slug)</label>
              <input v-model="form.id" placeholder="e.g. coffee-shop" required 
                     class="w-full border-2 border-black p-2 text-sm outline-none focus:bg-yellow-50" />
            </div>
            <div>
              <label class="block text-[10px] font-black uppercase mb-1">Subdomain</label>
              <input v-model="form.domain" placeholder="e.g. coffeeshop" required 
                     class="w-full border-2 border-black p-2 text-sm outline-none focus:bg-yellow-50" />
            </div>
          </div>

          <div class="border-t-2 border-black pt-4 mt-4">
            <p class="text-[10px] font-bold text-gray-400 uppercase mb-3">Admin Credentials (Initial)</p>
            <div class="space-y-3">
              <input v-model="form.email" type="email" placeholder="Admin Email" required 
                     class="w-full border-2 border-black p-2 text-sm outline-none focus:bg-emerald-50" />
              <input v-model="form.password" type="password" placeholder="Admin Password" required 
                     class="w-full border-2 border-black p-2 text-sm outline-none focus:bg-emerald-50" />
            </div>
          </div>
          
          <div class="flex gap-3 pt-6">
            <button type="submit" :disabled="loading"
                    class="flex-1 bg-black text-white font-black py-3 uppercase hover:bg-emerald-500 transition-colors disabled:bg-gray-400">
              {{ loading ? 'Provisioning...' : 'Deploy Database' }}
            </button>
            <button type="button" @click="isModalOpen = false" 
                    class="px-6 border-2 border-black font-black py-3 uppercase hover:bg-gray-100">
              Back
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, reactive } from 'vue'
import api from '../../api/axios'

const tenants = ref([])
const loading = ref(false)
const isModalOpen = ref(false)

const form = reactive({
  id: '',
  domain: '',
  email: '',
  password: ''
})

const fetchTenants = async () => {
  try {
    const res = await api.get('/central/tenants')
    tenants.value = res.data.data
  } catch (err) {
    console.error("Gagal mengambil data tenant")
  }
}

const openModal = () => {
  Object.assign(form, { id: '', domain: '', email: '', password: '' })
  isModalOpen.value = true
}

const deployTenant = async () => {
  // 1. VALIDASI FORM KOSONG
  if (!form.id || !form.domain || !form.email || !form.password) {
    alert("⚠️ All fields are required! Please fill in all tenant configuration details.");
    return; // Berhenti di sini, jangan lanjut hit API
  }

  loading.value = true
  try {
    // API ini akan mentrigger migration & seeder di Laravel
    await api.post('/central/tenants', form)
    alert("✅ Tenant Deployed Successfully!")
    isModalOpen.value = false
    fetchTenants()
  } catch (err) {
    alert("❌ Deployment Failed: " + (err.response?.data?.message || "Internal Server Error"));
  } finally {
    loading.value = false
  }
}

const deleteTenant = async (id) => {
  if (!confirm(`Delete tenant "${id}" and its entire database? This action cannot be undone.`)) return
  try {
    await api.delete(`/central/tenants/${id}`)
    fetchTenants()
  } catch (err) {
    alert("Gagal menghapus tenant")
  }
}

onMounted(fetchTenants)
</script>