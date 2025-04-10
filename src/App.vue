<script setup>
import { RouterView } from 'vue-router';
import BottomNav from './components/BottomNav.vue';
import './assets/main.css';
</script>

<template>
  <div class="app-wrapper">
    <div class="app-container">
      <RouterView />
      <BottomNav />
    </div>
  </div>
</template>

<style>
body {
  background-color: #f5f5f5;
  font-family: 'Pretendard', sans-serif;
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
</style>
