<template>
  <div class="min-h-screen bg-gray-50 font-sans text-slate-900">
    <nav class="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16 items-center">
          
          <div class="flex items-center gap-2">
            <div class="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-black italic">
              E-Commerce 
            </div>
            <span class="font-black text-xl tracking-tight text-slate-800 uppercase">
              {{ isTenant ? ' Tenant Store' : ' Central Hub' }}
            </span>
          </div>

          <div class="hidden md:flex items-center space-x-8">
            <router-link to="/" class="nav-link">Home</router-link>
            
            <template v-if="auth.token">
              <router-link v-if="isTenant" to="/cart" class="nav-link flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                Cart
              </router-link>

              <router-link v-if="!isTenant" to="/admin/central" class="nav-link">
                Super Admin
              </router-link>
            </template>
          </div>

          <div class="flex items-center gap-4">
            <template v-if="auth.token">
              <div class="flex items-center gap-3 pr-4 border-r border-slate-200">
                <div class="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold text-gray-600">
                  
                </div>
                <span class="text-sm font-medium text-gray-600 hidden sm:inline">My Account</span>
              </div>
              <button @click="handleLogout" class="btn-logout">
                Logout
              </button>
            </template>
            
            <router-link v-else to="/login" class="btn-login">
              Sign In
            </router-link>
          </div>

        </div>
      </div>
    </nav>

    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useAuthStore } from './stores/auth';
import { useRouter } from 'vue-router';

const auth = useAuthStore();
const router = useRouter();

const isTenant = computed(() => {
  const host = window.location.hostname;
  return host !== 'localhost' && host !== '127.0.0.1';
});

const handleLogout = () => {
  auth.logout();
  router.push('/login');
};
</script>
