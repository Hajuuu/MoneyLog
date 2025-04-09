<template>
  <div class="setting-profile-view">
    <div>
      <i class="fa-solid fa-arrow-left" @click="router.go(-1)"></i>
      <h2>내 정보 수정</h2>
    </div>
    <!-- 상단 바 -->
    <div>
      <!-- label input container -->
      <div>
        <!-- 이름 input container -->
        <label>이름</label>
        <input v-model="name" placeholder="이름을 입력하세요" />
      </div>
      <div>
        <!-- 이메일 input container -->
        <label>이메일</label>
        <input v-model="email" placeholder="이메일을 입력하세요" />
      </div>
    </div>

    <button @click="saveProfile">수정 완료</button>
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
