import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '../stores/auth';

const routes = [
  { path: '/login', component: () => import('../views/Login.vue') },
  { path: '/', component: () => import('../views/tenant/Katalog.vue') },
  { path: '/cart', component: () => import('../views/tenant/Cart.vue') },
  { 
    path: '/admin/central', 
    component: () => import('../views/central/Dashboard.vue'),
    meta: { requiresAuth: true, centralOnly: true }
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

router.beforeEach((to, from, next) => {
  const auth = useAuthStore();
  const isCentral = window.location.hostname === 'localhost';

  // Proteksi Central Admin
  if (to.meta.centralOnly && !isCentral) {
    return next('/');
  }

  // Proteksi Auth
  if (to.meta.requiresAuth && !auth.token) {
    return next('/login');
  }

  next();
});

export default router;