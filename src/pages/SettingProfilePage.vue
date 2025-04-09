<template>
  <div class="setting-profile-view container py-4">
    <!-- 상단 바 -->
    <div class="d-flex align-items-center mb-4">
      <i class="fa-solid fa-arrow-left me-3" @click="router.go(-1)"></i>
      <h4 class="mb-0 fw-bold">내 정보 수정</h4>
    </div>

    <!-- 입력 폼 -->
    <div class="mb-3 mt-5">
      <label class="form-label fw-medium ms-2">이름</label>
      <input
        v-model="name"
        type="text"
        class="form-control rounded-pill border-light shadow-sm px-4"
        placeholder="이름을 입력하세요"
      />
    </div>

    <div class="mb-4">
      <label class="form-label fw-medium ms-2">이메일</label>
      <input
        v-model="email"
        type="email"
        class="form-control rounded-pill border-light shadow-sm px-4"
        placeholder="이메일을 입력하세요"
      />
    </div>

    <!-- 수정 완료 버튼 -->
    <button
      class="btn btn-dark w-100 rounded-pill py-2 fw-semibold"
      @click="saveProfile"
    >
      수정 완료
    </button>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { settingAPI } from '@/api/index.js';

const router = useRouter();
const user = ref({ name: '', email: '' });
const name = ref('');
const email = ref('');

onMounted(async () => {
  const res = await settingAPI.getSetting(1);
  user.value = res.data;
  name.value = '';
  email.value = '';
});

const saveProfile = async () => {
  const updatedUser = {
    ...user.value,
    name: name.value,
    email: email.value,
  };

  // user.value.id를 첫 번째 인자로 넘기기!
  await settingAPI.updateSetting(user.value.id, updatedUser);

  router.push('/setting');
  alert('수정되었습니다');
};
</script>
