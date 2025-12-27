<template>
  <div class="space-y-8 p-6 bg-gray-50 min-h-screen">
    <div class="flex justify-between items-center border-b-2 border-black pb-6">
      <div>
        <h1 class="text-4xl font-black uppercase tracking-tighter italic text-slate-900">Platform Analytics</h1>
        <p class="text-sm font-mono text-slate-500">System Status: <span class="text-emerald-500 font-bold">● Operational</span></p>
      </div>
      <div class="text-right">
        <p class="text-xs font-bold text-slate-400 uppercase">Current Date</p>
        <p class="font-bold">{{ new Date().toLocaleDateString('id-ID', { dateStyle: 'long' }) }}</p>
      </div>
      <router-link 
        to="/admin/central/tenant" 
        class="border-2 border-black px-4 py-1 text-sm font-bold bg-black text-white hover:bg-gray-800 transition-colors"
      >
        To Tenant Management
      </router-link>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div class="bg-white border-2 border-black p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center gap-4">
        <div class="p-3 bg-blue-100 rounded-lg">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
        </div>
        <div>
          <p class="text-xs font-black uppercase text-slate-400">Total Tenants</p>
          <p class="text-3xl font-black text-slate-900">{{ tenantStore.tenants.length }}</p>
        </div>
      </div>

      <div class="bg-white border-2 border-black p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center gap-4">
        <div class="p-3 bg-emerald-100 rounded-lg">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 7v10c0 2.21 3.58 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.58 4 8 4s8-1.79 8-4M4 7c0-2.21 3.58-4 8-4s8 1.79 8 4m0 5c0 2.21-3.58 4-8 4s-8-1.79-8-4" />
          </svg>
        </div>
        <div>
          <p class="text-xs font-black uppercase text-slate-400">Databases Active</p>
          <p class="text-3xl font-black text-slate-900">{{ tenantStore.tenants.length }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, reactive } from 'vue';
import { useTenantStore } from '../../stores/tenant';

const tenantStore = useTenantStore();
const form = reactive({ id: '', domain: '', email: '', password: '' });

const submitTenant = async () => {
  if (!form.id || !form.domain || !form.email || !form.password) {
    alert('Please fill all fields');
    return;
  }
  
  try {
    await tenantStore.createTenant({ ...form });
    alert('SUCCESS: Infrastructure and Database Deployed.');
    Object.assign(form, { id: '', domain: '', email: '', password: '' });
  } catch (err) {
    alert('PROVISIONING FAILED: Check console for logs.');
  }
};

const handleDelete = (id) => {
  if (confirm(`CRITICAL ACTION: Terminate tenant "${id}"? This will drop the database.`)) {
    tenantStore.deleteTenant(id);
  }
};

onMounted(() => tenantStore.fetchTenants());
</script>