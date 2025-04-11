<template>
  <div class="setting-img-view container py-4">
    <!-- 상단 아이콘 -->
    <div class="d-flex justify-content-end">
      <button class="btn btn-link me-2" @click="router.go(-1)">
        <i class="fas fa-xmark"></i>
      </button>
    </div>

    <!-- 안내 문구 -->
    <div class="text-start my-4">
      <h2 class="fw-bold lh-base mb-2" style="font-size: 1.5rem">
        프로필 이미지를 <br />설정하세요.
      </h2>
      <br />
      <p class="text-muted fw-bold mb-0 small">
        친구들에게 보여줄 나만의 프로필이에요.
      </p>
    </div>
    <!-- 선택된 이미지 미리보기 -->
    <div v-if="selectedImage?.checked" class="text-center mb-4">
      <img
        :src="selectedImage.checked"
        alt="선택된 이미지"
        class="rounded-circle"
        style="width: 100px; height: 100px"
      />
    </div>

    <!-- 프로필 이미지 선택 목록 -->
    <div class="bg-light rounded p-3 mb-4">
      <span class="d-block ms-2 mb-2 text-muted fw-bold small"
        >기본 프로필 이미지에서 선택</span
      >
      <div class="d-flex justify-content-start gap-3">
        <div
          v-for="img in profileImages"
          :key="img.id"
          @click="selectImage(img.id)"
          class="cursor-pointer"
          style="width: 50px; height: 50px"
        >
          <img
            :src="selectedImageId === img.id ? img.checked : img.unchecked"
            class="img-fluid rounded-circle"
          />
        </div>
      </div>
    </div>

    <!-- 저장 버튼 -->
    <button class="btn btn-primary w-100" @click="saveProfile">
      수정 완료
    </button>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useSettingStore } from '@/stores/setting.js';

// 이미지 import
import checked1 from '@/assets/profileImage/imageChecked1.svg';
import checked2 from '@/assets/profileImage/imageChecked2.svg';
import checked3 from '@/assets/profileImage/imageChecked3.svg';
import checked4 from '@/assets/profileImage/imageChecked4.svg';

import unchecked1 from '@/assets/profileImage/imageUnchecked1.svg';
import unchecked2 from '@/assets/profileImage/imageUnchecked2.svg';
import unchecked3 from '@/assets/profileImage/imageUnchecked3.svg';
import unchecked4 from '@/assets/profileImage/imageUnchecked4.svg';

// 이미지 목록
const profileImages = [
  { id: 1, checked: checked1, unchecked: unchecked1 },
  { id: 2, checked: checked2, unchecked: unchecked2 },
  { id: 3, checked: checked3, unchecked: unchecked3 },
  { id: 4, checked: checked4, unchecked: unchecked4 },
];

const router = useRouter();
const settingStore = useSettingStore();

const selectedImageId = ref(1);

// 선택된 이미지
const selectedImage = computed(() =>
  profileImages.find((img) => img.id === selectedImageId.value)
);

// 유저 정보 불러오기
onMounted(async () => {
  await settingStore.fetchSetting(1);
  selectedImageId.value = settingStore.setting?.image || 1;
});

// 이미지 선택
const selectImage = (id) => {
  selectedImageId.value = id;
};

// 저장
const saveProfile = async () => {
  const updated = {
    ...settingStore.setting,
    image: selectedImageId.value,
  };

  await settingStore.updateSetting(settingStore.setting.id, updated);
  router.push('/setting');
};
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
