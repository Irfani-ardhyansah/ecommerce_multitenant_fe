<template>
  <div class="p-8">
    <h1 class="text-3xl font-bold mb-8">Super Admin Dashboard</h1>
    
    <div class="bg-gray-100 p-6 rounded-lg mb-8">
      <h2 class="text-xl mb-4">Create New Tenant Store</h2>
      <div class="grid grid-cols-2 gap-4">
        <input v-model="form.id" placeholder="Tenant ID (e.g. toko-budi)" class="p-2 border" />
        <input v-model="form.domain" placeholder="Subdomain (e.g. tokobudi)" class="p-2 border" />
        <input v-model="form.email" placeholder="Admin Email" class="p-2 border" />
        <input v-model="form.password" type="password" placeholder="Password" class="p-2 border" />
      </div>
      <button @click="submitTenant" class="mt-4 bg-green-500 text-white px-6 py-2 rounded">Create Store</button>
    </div>

    <table class="w-full border-collapse border">
      <thead>
        <tr class="bg-gray-200">
          <th class="border p-2">ID</th>
          <th class="border p-2">Domain</th>
          <th class="border p-2">Action</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="t in tenantStore.tenants" :key="t.id">
          <td class="border p-2">{{ t.id }}</td>
          <td class="border p-2">
            <a :href="'http://' + t.domains[0]?.domain + ':5173'" target="_blank" class="text-blue-500 underline">
              {{ t.domains[0]?.domain }}
            </a>
          </td>
          <td class="border p-2 text-center">
            <button @click="tenantStore.deleteTenant(t.id)" class="text-red-500">Delete</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { onMounted, reactive } from 'vue';
import { useTenantStore } from '../../stores/tenant';

const tenantStore = useTenantStore();
const form = reactive({ id: '', domain: '', email: '', password: '' });

const submitTenant = async () => {
  try {
    await tenantStore.createTenant({ ...form });
    alert('Store and Database Created Successfully!');
    Object.assign(form, { id: '', domain: '', email: '', password: '' });
  } catch (err) {
    alert('Failed to create tenant');
  }
};

onMounted(() => tenantStore.fetchTenants());
</script>