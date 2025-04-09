<script setup></script>

<template>
  <div class="setting-img-view">
    <div>
      <i class="xmark"></i>
    </div>
    <!-- 상단 마크 -->
    <div>
      <h3>프로필 이미지를 설정하세요.</h3>
      <p>친구들에게 보여줄 나만의 프로필이에요.</p>
    </div>
    <!-- 프로필 이미지 설정 안내 문구 -->
    <div>
      <img />
    </div>
    <!-- 가운데 정렬 교체 이미지 -->
    <div>
      <img v-for="img in profileImages" :key="img" :src="img" class="" />
      <!-- 프로필 이미지 리스트 -->
    </div>
    <button>수정 완료</button>
    <!-- 완료 버튼 -->
  </div>
</template>

<style scoped></style>
