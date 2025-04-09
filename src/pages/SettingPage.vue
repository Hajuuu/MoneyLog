<script setup></script>

<template>
  <div class="setting-view">
    <!-- 상단 헤더 -->
    <div class="">
      <h4>설정</h4>
      <button class="">수정</button>
    </div>
    <!-- 프로필 이미지 -->
    <div class="">
      <div class="">
        <img :src="defaultAvatar" class="" style="width: 100px; height: 100px" alt="" />
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

<style scoped></style>
