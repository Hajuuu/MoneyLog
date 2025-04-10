import { createRouter, createWebHistory } from 'vue-router';
import HomePage from '../pages/HomePage.vue';
import TransactionsPage from '../pages/TransactionsPage.vue';
import MonthlyTransactionsPage from '../pages/MonthlyTransactionsPage.vue';
import StatisticsPage from '../pages/StatisticsPage.vue';
import GoalPage from '../pages/GoalPage.vue';
import SettingPage from '../pages/SettingPage.vue';
import SettingImgPage from '../pages/SettingImgPage.vue';
import SettingProfilePage from '../pages/SettingProfilePage.vue';
import DetailPage from '@/pages/DetailPage.vue';
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
    {
      path: '/monthly-transactions',
      name: 'monthly-transactions',
      component: MonthlyTransactionsPage,
    },
    {
      path: '/statistics',
      name: 'statistics',
      component: StatisticsPage,
    },
    {
      path: '/goal',
      name: 'goal',
      component: GoalPage,
    },
    {
      path: '/setting',
      name: 'setting',
      component: SettingPage,
    },
    ,
    {
      path: '/setting/edit',
      component: SettingProfilePage,
    },
    {
      path: '/setting/image',
      component: SettingImgPage,
    },
    {
      path: '/transactions/detail/:id',
      component: DetailPage,
    },
  ],
});

export default router;
