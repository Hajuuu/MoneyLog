import { createRouter, createWebHistory } from 'vue-router';
import HomePage from '../pages/HomePage.vue';
import TransactionsPage from '../pages/TransactionsPage.vue';
import StatisticsPage from '../pages/StatisticsPage.vue';
import GoalPage from '../pages/GoalPage.vue';
import SettingPage from '../pages/SettingPage.vue';
import SettingImgPage from '../pages/SettingImgPage.vue';
import SettingProfilePage from '../pages/SettingProfilePage.vue';

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
    {
      path: '/setting/img',
      name: 'settingimg',
      component: SettingImgPage,
    },
    {
      path: '/setting/profile',
      name: 'settingprofile',
      component: SettingProfilePage,
    },
  ],
});

export default router;
