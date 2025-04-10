<template>
  <div class="container py-4 setting-view">
    <!-- 상단 타이틀 & 수정 버튼 -->
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h2 class="fw-bold">설정</h2>
      <button class="btn btn-link">
        <span @click="goToEdit">수정</span>
      </button>
    </div>

    <!-- 프로필 이미지 -->
    <div class="text-center position-relative mb-4">
      <img
        :src="selectedProfileImage"
        alt="프로필 이미지"
        class="border-0 mb-4"
        style="width: 100px; height: 100px; object-fit: cover"
        @click="goToImageEdit"
      />
      <span
        class="position-absolute top-100 start-50 translate-middle"
        style="cursor: pointer; font-size: 1.2rem"
        @click="goToImageEdit"
      >
      </span>
    </div>

    <!-- 유저 정보 -->
    <div class="mb-2 mt-2 d-flex justify-content-between border-bottom py-2">
      <span class="fw-semibold">이름</span>
      <span>{{ user.name }}</span>
    </div>
    <div class="mb-2 mt-4 d-flex justify-content-between border-bottom py-2">
      <span class="fw-semibold">이메일 주소</span>
      <span>{{ user.email }}</span>
    </div>
  </div>
</template>

<script setup>
import { onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useSettingStore } from '@/stores/setting.js';

// 기본 이미지
import default1 from '@/assets/profileImage/defaultImage1.svg';
import default2 from '@/assets/profileImage/defaultImage2.svg';
import default3 from '@/assets/profileImage/defaultImage3.svg';
import default4 from '@/assets/profileImage/defaultImage4.svg';

const router = useRouter();
const settingStore = useSettingStore();

onMounted(async () => {
  try {
    await settingStore.fetchSetting(1);
  } catch (err) {
    console.error('유저 정보 불러오기 실패:', err);
  }
});
const user = computed(() => settingStore.setting);
//api불러오면 그때 작업 시작

// 현재 선택된 이미지 경로 (숫자 ID를 파일로 매핑)
const selectedProfileImage = computed(
  () =>
    ({
      1: default1,
      2: default2,
      3: default3,
      4: default4,
    }[user.value?.image] || default1)
);

const goToEdit = () => router.push('/setting/edit');
const goToImageEdit = () => router.push('/setting/image');
</script>

<style scoped>
.btn-link {
  color: #333;
  text-decoration: none;
  padding: 0;
}

.btn-link:hover {
  color: #007bff;
}
</style>
