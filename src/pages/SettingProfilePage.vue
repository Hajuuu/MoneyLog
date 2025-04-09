<script setup></script>

<template>
  <div class="setting-profile-view">
    <div>
      <i class="fa-solid fa-arrow-left"></i>
      <h2>내 정보 수정</h2>
    </div>
    <div>
      <div>
        <label>이름</label>
        <input v-model="user.name" />
      </div>
      <div>
        <label>이메일</label>
        <input v-model="user.email" />
      </div>
    </div>
    <button>수정 완료</button>
  </div>
</template>

<style scoped></style>
