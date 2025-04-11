<script setup>
import { useRouter, useRoute } from 'vue-router';
import { computed } from 'vue';

const router = useRouter();
const route = useRoute();
const currentRoute = computed(() => route.name);

const navigate = (routeName) => {
  if (route.name !== routeName) {
    router.push({ name: routeName });
  }
};
</script>

<template>
  <nav class="bottom-nav">
    <div
      class="nav-item"
      @click="navigate('home')"
      :class="{ active: currentRoute === 'home' }"
    >
      <i class="fas fa-home"></i>
      <span>홈</span>
    </div>
    <div
      class="nav-item"
      @click="navigate('transactions')"
      :class="{ active: currentRoute === 'transactions' }"
    >
      <i class="fas fa-list"></i>
      <span>거래내역</span>
    </div>
    <div
      class="nav-item"
      @click="navigate('statistics')"
      :class="{ active: currentRoute === 'statistics' }"
    >
      <i class="fas fa-chart-bar"></i>
      <span>통계</span>
    </div>
    <div
      class="nav-item"
      @click="navigate('goal')"
      :class="{ active: currentRoute === 'goal' }"
    >
      <i class="fas fa-bullseye"></i>
      <span>목표</span>
    </div>
    <div
      class="nav-item"
      @click="navigate('setting')"
      :class="{ active: currentRoute === 'setting' }"
    >
      <i class="fas fa-cog"></i>
      <span>설정</span>
    </div>
  </nav>
</template>

<style scoped>
.bottom-nav {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  max-width: 430px;
  margin: 0 auto;
  height: 60px;
  background-color: white;
  display: flex;
  justify-content: space-around;
  align-items: center;
  border-top: 1px solid #eee;
  z-index: 1000;
}

.nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex: 1;
  height: 100%;
  cursor: pointer;
  color: #666;
  transition: color 0.3s;
}

.nav-item i {
  font-size: 1.2rem;
  margin-bottom: 4px;
}

.nav-item span {
  font-size: 0.7rem;
}

.nav-item.active {
  color: #007bff;
}

.nav-item:hover {
  color: #0056b3;
}

/* 브라우저 크기 늘렸을때 반응형 스타일 */
@media (min-width: 1024px) {
  .bottom-nav.desktop-nav {
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    right: auto;
    max-width: 80px;
    width: 80px;
    height: 100vh;
    flex-direction: column;
    margin: 0;
    border-top: none;
    border-right: 1px solid #eee;
    overflow-y: auto;
    z-index: 1001;
  }

  .bottom-nav.desktop-nav .nav-item {
    flex-direction: column;
    padding: 15px 0;
  }

  .bottom-nav.desktop-nav .nav-item i {
    font-size: 1.5rem;
    margin-bottom: 8px;
  }

  .bottom-nav.desktop-nav .nav-item span {
    font-size: 0.8rem;
  }

  .bottom-nav.mobile-nav {
    display: none !important;
  }
}
</style>
