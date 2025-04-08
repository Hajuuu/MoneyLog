<template>
  <div class="container">
    <!-- 상단 헤더 -->
    <div class="">
      <h4>설정</h4>
      <button class="btn">수정</button>
    </div>

    <!-- 프로필 이미지 -->
    <div class="">
      <div class="">
        <img
          :src="defaultAvatar"
          class="profileImage"
          style="width: 100px; height: 100px"
          alt="프로필"
        />
        <span class="" style="font-size: 0.9rem">
          <i class="fas fa-pen"></i>
        </span>
      </div>
    </div>

    <!-- 유저 정보 -->
    <div class="">
      <div class="">
        <span class="">이름</span>
        <span>{{ user.name }}</span>
      </div>
      <div class="">
        <span class="">이메일 주소</span>
        <span>{{ user.email }}</span>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, onMounted } from 'vue';

const user = ref({
  name: '',
  email: '',
  image: '',
});

const defaultAvatar = 'https://via.placeholder.com/100';

onMounted(async () => {
  try {
    const res = await fetch('http://localhost:3001/user');
    const data = await res.json();
    user.value = data;
  } catch (error) {
    console.error('유저 정보 불러오기 실패:', error);
  }
});
</script>
