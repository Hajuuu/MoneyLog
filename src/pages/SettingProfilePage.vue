<template>
  <div class="setting-profile-view container py-4">
    <!-- 상단 바 -->
    <div class="d-flex align-items-center mb-4">
      <button class="btn btn-link me-2" @click="router.go(-1)">
        <i class="fas fa-arrow-left"></i>
      </button>
      <h4 class="mb-0 fw-bold">내 정보 수정</h4>
    </div>

    <!-- 입력 폼 -->
    <div class="mb-3 mt-5">
      <label class="form-label fw-medium ms-2">이름</label>
      <input
        v-model="name"
        type="text"
        class="form-control"
        placeholder="이름을 입력하세요"
      />
    </div>

    <div class="mb-4">
      <label class="form-label fw-medium ms-2">이메일</label>
      <input
        v-model="email"
        type="email"
        class="form-control"
        placeholder="이메일을 입력하세요"
      />
    </div>

    <!-- 수정 완료 버튼 -->
    <button class="btn btn-primary w-100" @click="saveProfile">
      수정 완료
    </button>
    <!-- 알림 모달 -->
    <div
      class="alert-modal"
      v-if="showAlertModal"
      @click.self="showAlertModal = false"
    >
      <div class="alert-modal-content">
        <p class="alert-message">{{ alertMessage }}</p>
        <button class="btn btn-primary w-100" @click="showAlertModal = false">
          확인
        </button>
      </div>
    </div>

    <!-- 성공 알림 모달 -->
    <div class="success-modal" v-if="showSuccessModal">
      <div class="success-modal-content">
        <p class="success-message">프로필 수정 완료</p>
      </div>
    </div>
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
const showAlertModal = ref(false);
const showSuccessModal = ref(false);
const alertMessage = ref('');

onMounted(async () => {
  await settingStore.fetchSetting(1);
  name.value = settingStore.setting.name;
  email.value = settingStore.setting.email;
});

const saveProfile = async () => {
  if (!name.value || !email.value) {
    alertMessage.value = '이름과 이메일을 모두 입력해주세요.';
    showAlertModal.value = true;
    return;
  }
  const updatedUser = {
    ...settingStore.setting,
    name: name.value,
    email: email.value,
  };
  //store에 업데이트 내용 올리기
  await settingStore.updateSetting(settingStore.setting.id, updatedUser);
  showSuccessModal.value = true;

  setTimeout(() => {
    showSuccessModal.value = false;
    router.push('/setting');
  }, 1000);

  router.push('/setting');
};
</script>

<style scoped>
.add-transaction-modal {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  background: white;
  z-index: 1050;
  transform: translateX(100%);
  transition: transform 0.3s ease-in-out;
}

.add-transaction-modal.visible {
  transform: translateX(0);
}

.category-modal {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  top: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: flex-end;
  z-index: 1060;
}

.category-modal-content {
  background-color: white;
  width: 100%;
  max-width: 430px;
  margin: 0 auto;
  border-top-left-radius: 16px;
  border-top-right-radius: 16px;
  padding: 20px;
  margin-bottom: 60px;
  overflow-y: auto;
}

.list-group-item {
  border: none;
  padding: 15px;
  cursor: pointer;
  text-align: center;
  transition: background-color 0.2s;
}

.list-group-item:hover {
  background-color: #f8f9fa;
}

.btn-link {
  color: #333;
  text-decoration: none;
  padding: 0;
}

.btn-link:hover {
  color: #007bff;
}

/* 입력 필드 스타일링 */
.form-control {
  border-radius: 8px;
  padding: 12px;
}

.form-label {
  font-weight: 500;
  margin-bottom: 8px;
}

/* 버튼 그룹 스타일링 */
.btn-group .btn {
  flex: 1;
  padding: 12px;
  border: 1px solid #0d6efd;
  color: #0d6efd;
}

.btn-group .btn.btn-primary {
  background-color: #0d6efd;
  color: white;
}

.btn-group .btn:not(.btn-primary) {
  background-color: white;
}

.disabled-button {
  background-color: #e9ecef;
  cursor: not-allowed;
  opacity: 0.65;
}

.alert-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
}

.alert-modal-content {
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  width: 90%;
  max-width: 320px;
}

.alert-message {
  text-align: center;
  margin-bottom: 20px;
  font-size: 16px;
  color: #333;
}

.success-modal {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 2000;
}

.success-modal-content {
  background-color: rgba(0, 0, 0, 0.7);
  padding: 12px 24px;
  border-radius: 4px;
  color: white;
  font-size: 14px;
  animation: fadeInOut 0.5s ease-in-out;
}

/* 모달 등장효과  우-> 좌 */
@keyframes fadeInOut {
  0% {
    opacity: 0;
    transform: translateY(10px);
  }
  20% {
    opacity: 1;
    transform: translateY(0);
  }
  80% {
    opacity: 1;
    transform: translateY(0);
  }
  100% {
    opacity: 0;
    transform: translateY(-10px);
  }
}
</style>
