<template>
  <div class="setting-img-view container py-4">
    <!-- 상단 아이콘 -->
    <div class="d-flex justify-content-end">
      <i
        class="fa-solid fa-xmark fs-4"
        @click="router.go(-1)"
        role="button"
      ></i>
    </div>

    <!-- 안내 문구 -->
    <div class="text-center my-3">
      <h4 class="fw-bold">프로필 이미지를 설정하세요.</h4>
      <p class="text-muted small">친구들에게 보여줄 나만의 프로필이에요.</p>
    </div>

    <!-- 선택된 이미지 미리보기 -->
    <div class="text-center mb-4">
      <img
        :src="selectedImage.checked"
        alt="선택된 이미지"
        class="rounded-circle"
        style="width: 100px; height: 100px"
      />
    </div>

    <!-- 프로필 이미지 선택 목록 -->
    <div class="bg-light rounded p-3 d-flex justify-content-center gap-3 mb-4">
      <div
        v-for="img in profileImages"
        :key="img.id"
        @click="selectImage(img.id)"
        class="cursor-pointer"
        style="width: 50px; height: 50px"
      >
        <img
          :src="selectedImageId === img.id ? img.checked : img.unchecked"
          class="img-fluid rounded-circle border"
        />
      </div>
    </div>

    <!-- 저장 버튼 -->
    <button
      class="btn btn-dark w-100 rounded-pill py-2 fw-semibold"
      @click="saveProfile"
    >
      수정 완료
    </button>
  </div>
</template>

<script setup>
import { settingAPI } from '@/api/index.js';
import { computed, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

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

const user = ref({ image: null }); // image는 숫자 id
const selectedImageId = ref(1); //초기화면 1번으로 출력

const router = useRouter();

// 선택된 이미지 객체
const selectedImage = computed(() =>
  profileImages.find((img) => img.id === selectedImageId.value)
);

// 초기 로딩
onMounted(async () => {
  const res = await settingAPI.getSetting(1);
  user.value = res.data;
});

// 이미지 선택
const selectImage = (id) => {
  selectedImageId.value = id;
  user.value.image = id;
};

// 저장
// 저장
const saveProfile = async () => {
  await settingAPI.updateSetting(user.value.id, user.value); //  id 따로 넘기기
  router.push('/setting');
};
</script>
