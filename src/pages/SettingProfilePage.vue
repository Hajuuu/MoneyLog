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
import { useSettingStore } from '@/stores/setting.js';

const router = useRouter();
const settingStore = useSettingStore();

const name = ref('');
const email = ref('');

onMounted(async () => {
  await settingStore.fetchSetting(1);
});

const saveProfile = async () => {
  const updatedUser = {
    ...settingStore.setting,
    name: name.value,
    email: email.value,
  };
  //store에 업데이트 내용 올리기
  await settingStore.updateSetting(settingStore.setting.id, updatedUser);

  router.push('/setting');
  alert('수정되었습니다');
};
</script>
