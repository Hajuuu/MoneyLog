<template>
  <div class="setting-view">
    <!-- 상단 타이틀 & 수정 버튼 -->
    <div>
      <h2>설정</h2>
      <button @click="goToEdit">수정</button>
    </div>

    <!-- 프로필 이미지 -->
    <div>
      <img
        :src="selectedProfileImage"
        alt="프로필 이미지"
        @click="goToImageEdit"
        style="width: 100px; height: 100px"
      />

      <span style="font-size: 0.9rem" @click="goToImageEdit">
        <i class="fas fa-pen"></i>
      </span>
    </div>
    <!-- 유저 정보 -->
    <div>
      <div>
        <span>이름</span>
        <span>{{ user.name }}</span>
      </div>
      <div>
        <span>이메일 주소</span>
        <span>{{ user.email }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
// import { userApi } from '@/api';

// 기본 이미지
// import default1 from '@/assets/profileImage/defaultImage1.svg';
// import default2 from '@/assets/profileImage/defaultImage2.svg';
// import default3 from '@/assets/profileImage/defaultImage3.svg';
// import default4 from '@/assets/profileImage/defaultImage4.svg';

const router = useRouter();
const user = ref({ name: '', email: '', image: '' });

// onMounted(async () => {
//   try {
//     const res = await userApi.getUser();
//     console.log(res.data);
//     console.log(user);
//     user.value = res.data;
//   } catch (err) {
//     console.error('유저 정보 불러오기 실패:', err);
//   }
// });
//api불러오면 그때 작업 시작

// 현재 선택된 이미지 경로 (숫자 ID를 파일로 매핑)
// const selectedProfileImage = computed(() => {
//   const map = {
//     1: default1,
//     2: default2,
//     3: default3,
//     4: default4,
//   };
//   return map[user.value.image];
// });
//api불러오면 작업 시작

const goToEdit = () => router.push('/SettingProfilePage');
const goToImageEdit = () => router.push('/SettingImgPage');
</script>
