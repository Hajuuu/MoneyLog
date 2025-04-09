<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useBudgetStore } from '../stores/budget';
import axios from 'axios';

const router = useRouter();
const budgetStore = useBudgetStore();
const emit = defineEmits(['close']);
const type = ref(''); // 초기값을 빈 문자열로 변경
const date = ref(new Date().toISOString().split('T')[0]);
const amount = ref('');
const category = ref('');
const memo = ref('');
const showCategoryModal = ref(false);
const showAlertModal = ref(false);
const alertMessage = ref('');
const showSuccessModal = ref(false);

// 선택된 타입에 따른 카테고리 목록
const currentCategories = computed(() => {
  return type.value === 'income'
    ? budgetStore.incomeCategoryNames
    : budgetStore.expenseCategoryNames;
});

// 모달 높이 계산
const modalHeight = computed(() => {
  const itemHeight = 52; // 각 카테고리 항목의 높이 (padding 포함)
  const paddingHeight = 40; // 모달 상하 패딩
  const minHeight = 200; // 최소 높이
  const calculatedHeight = currentCategories.value.length * itemHeight + paddingHeight;
  return Math.max(calculatedHeight, minHeight);
});

// 카테고리 버튼 텍스트
const categoryButtonText = computed(() => {
  return category.value || '카테고리 선택';
});

// 거래내역 추가
const addTransaction = async () => {
  if (!amount.value || !category.value) {
    alertMessage.value = '금액과 카테고리를 입력해주세요.';
    showAlertModal.value = true;
    return;
  }

  try {
    await budgetStore.addTransaction({
      type: type.value,
      amount: parseInt(amount.value),
      category: category.value,
      description: memo.value,
      date: date.value,
    });

    // 성공 모달 표시
    showSuccessModal.value = true;

    // 0.5초 후에 모달 닫고 이전 페이지로 이동
    setTimeout(() => {
      showSuccessModal.value = false;
      emit('close');
    }, 500);
  } catch (error) {
    console.error('거래내역 추가에 실패했습니다:', error);
  }
};

// 타입 변경 핸들러
const handleTypeChange = (newType) => {
  type.value = newType;
  category.value = ''; // 카테고리 초기화
};

// 카테고리 선택
const selectCategory = (selectedCategory) => {
  category.value = selectedCategory;
  showCategoryModal.value = false;
};

// 뒤로가기
const goBack = () => {
  const previousRoute = sessionStorage.getItem('previousRoute') || '/';
  router.push(previousRoute);
  emit('close');
};

onMounted(async () => {
  // 현재 경로 저장 (뒤로가기 눌렀을때 이전페이지 가도록)
  sessionStorage.setItem('previousRoute', router.currentRoute.value.fullPath);

  // 모달 나오기 전에 카테고리 데이터 먼저 가져오기
  await budgetStore.fetchCategories();

  // 모달 애니메이션 스르륵 나오게
  setTimeout(() => {
    document.querySelector('.add-transaction-modal').classList.add('visible');
  }, 0);
});
</script>

<template>
  <div class="add-transaction-modal">
    <header class="d-flex justify-content-between align-items-center p-3 border-bottom">
      <button class="btn btn-link" @click="goBack">
        <i class="fas fa-arrow-left"></i>
      </button>
      <h2 class="mb-0">거래내역 추가</h2>
      <div style="width: 24px"></div>
    </header>

    <div class="p-3">
      <div class="mb-4">
        <label class="form-label">날짜</label>
        <input type="date" v-model="date" class="form-control" />
      </div>

      <div class="btn-group w-100 mb-4">
        <button
          class="btn"
          :class="type === 'income' ? 'btn-primary' : 'btn-outline-primary'"
          @click="handleTypeChange('income')"
        >
          수입
        </button>
        <button
          class="btn"
          :class="type === 'expense' ? 'btn-primary' : 'btn-outline-primary'"
          @click="handleTypeChange('expense')"
        >
          지출
        </button>
      </div>

      <div class="mb-4">
        <label class="form-label">카테고리</label>
        <button
          class="form-control text-start"
          @click="showCategoryModal = true"
          :disabled="!type"
          :class="{ 'disabled-button': !type }"
        >
          {{ categoryButtonText }}
          <i class="fas fa-chevron-right float-end mt-1"></i>
        </button>
      </div>

      <div class="mb-4">
        <label class="form-label">금액</label>
        <input
          type="number"
          v-model="amount"
          class="form-control"
          placeholder="금액을 입력하세요"
        />
      </div>

      <div class="mb-4">
        <label class="form-label">메모</label>
        <input
          type="text"
          v-model="memo"
          class="form-control"
          placeholder="메모를 입력하세요"
        />
      </div>

      <button class="btn btn-primary w-100" @click="addTransaction">추가</button>
    </div>

    <!-- 카테고리 선택 모달 -->
    <div
      class="category-modal"
      v-if="showCategoryModal"
      @click.self="showCategoryModal = false"
    >
      <div class="category-modal-content" :style="{ height: modalHeight + 'px' }">
        <div class="list-group">
          <button
            v-for="cat in currentCategories"
            :key="cat"
            class="list-group-item"
            @click="selectCategory(cat)"
          >
            {{ cat }}
          </button>
        </div>
      </div>
    </div>

    <!-- 알림 모달 -->
    <div class="alert-modal" v-if="showAlertModal" @click.self="showAlertModal = false">
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
        <p class="success-message">거래내역 추가 완료</p>
      </div>
    </div>
  </div>
</template>

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
