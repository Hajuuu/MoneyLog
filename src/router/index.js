import { createRouter, createWebHistory } from 'vue-router';
import HomePage from '../pages/HomePage.vue';
import TransactionsPage from '../pages/TransactionsPage.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomePage,
    },
    {
      path: '/transactions',
      name: 'transactions',
      component: TransactionsPage,
    },
  ],
});

export default router;
