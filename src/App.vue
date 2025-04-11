<script setup>
import { RouterView } from 'vue-router';
import BottomNav from './components/BottomNav.vue';
import './assets/main.css';
</script>

<template>
  <div class="app-wrapper">
    <div class="app-container">
      <RouterView />
      <BottomNav class="mobile-nav" />
      <BottomNav class="desktop-nav" />
    </div>
  </div>
</template>

<style>
body {
  background-color: #f5f5f5;
  font-family: 'Pretendard', sans-serif;
  margin: 0;
  padding: 0;
}

.app-wrapper {
  display: flex;
  justify-content: center;
  min-height: 100vh;
  width: 100%;
}

.app-container {
  position: relative;
  width: 100%;
  max-width: 430px;
  min-width: 360px;
  min-height: 520px;
  height: 100vh;
  background-color: white;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  overflow-y: auto;
  margin: 0 auto;
}

/* 브라우저 크기 늘렸을때 반응형 스타일 */
@media (min-width: 1024px) {
  .app-wrapper {
    justify-content: flex-start;
    align-items: stretch;
    position: relative;
  }

  .app-container {
    margin-left: 80px; /* BottomNav 너비만큼 왼쪽 여백 */
    margin-right: auto;
    max-width: calc(100% - 80px);
    padding-bottom: 0;
  }

  .mobile-nav {
    display: none !important; /* !important 로 무조건 적용! */
  }

  .desktop-nav {
    display: flex !important;
  }
}

/* 모바일 크기일 때 스타일 */
@media (max-width: 1023px) {
  .desktop-nav {
    display: none; /* 데스크탑 네비게이션 숨김 */
  }

  .mobile-nav {
    display: flex; /* 모바일 네비게이션 표시 */
  }
}
</style>
