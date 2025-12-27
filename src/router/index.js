import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '../stores/auth';

const routes = [
  { path: '/login', component: () => import('../views/Login.vue') },
  { path: '/', component: () => import('../views/tenant/Katalog.vue') },
  { path: '/cart', component: () => import('../views/tenant/Cart.vue') },
  { 
    path: '/admin/products', 
    component: () => import('../views/tenant/ProductManagement.vue'),
    meta: { requiresAuth: true } 
  },
  { 
    path: '/admin/central', 
    component: () => import('../views/central/Dashboard.vue'),
    meta: { requiresAuth: true, centralOnly: true }
  },
  { 
  path: '/admin/central/tenant', 
  component: () => import('../views/central/TenantManagement.vue'),
  meta: { requiresAuth: true, centralOnly: true } 
},
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

router.beforeEach((to, from, next) => {
  const auth = useAuthStore();
  const host = window.location.hostname;
  const isCentral = host === 'localhost' || host === '127.0.0.1';

  if (to.meta.centralOnly && !isCentral) {
    return next('/');
  }

  if (to.meta.requiresAuth && !auth.token) {
    return next('/login');
  }

  if (to.path.startsWith('/admin/products')) {
    if (auth.user?.role !== 'admin') {
      alert("Akses Ditolak: Halaman ini hanya untuk Admin Toko.");
      return next('/'); // Lempar ke katalog jika bukan admin
    }
  }

  if (to.path === '/login' && auth.token) {
    if (isCentral) {
      return next('/admin/central');
    } else {
      return auth.user?.role === 'admin' ? next('/admin/products') : next('/');
    }
  }

  next();
});

export default router;