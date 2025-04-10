<template>
  <div class="detail-view">
    <header class="d-flex justify-content-between align-items-center p-3 border-bottom">
      <button class="btn btn-link" @click="goBack">
        <i class="fas fa-arrow-left"></i>
      </button>
      <h2 class="transaction-text mb-0">거래 상세</h2>
      <div style="width: 24px"></div>
    </header>

    <div v-if="transaction" class="transaction-detail">
      <div class="detail-item">
        <div class="item-label">날짜</div>
        <div class="item-content">{{ transaction.date }}</div>
      </div>

      <div class="detail-item">
        <div class="item-label">카테고리</div>
        <div class="item-content">{{ transaction.category }}</div>
      </div>

      <div class="detail-item">
        <div class="item-label">금액</div>
        <div
          class="item-content amount"
          :class="transaction.type === 'income' ? 'text-success' : 'text-danger'"
        >
          {{ formatCurrency(transaction.amount) }}
        </div>
      </div>

      <div class="detail-item" v-if="transaction.memo">
        <div class="item-label">메모</div>
        <div class="item-content">{{ transaction.memo }}</div>
      </div>

      <div class="btn-group w-100 mb-4 mt-5">
        <button class="btn btn-primary" @click="showEdit = true">수정</button>
        <button class="btn btn-danger" @click="handleDelete">삭제</button>
      </div>
    </div>

    <!-- 수정 모달 -->
    <EditTransactionModal
      v-if="showEdit"
      :transactionData="transaction"
      @close="showEdit = false"
      @update="handleUpdate"
    />

    <!-- 알림 모달 -->
    <div class="alert-modal" v-if="showAlertModal" @click.self="showAlertModal = false">
      <div class="alert-modal-content">
        <p class="alert-message">{{ alertMessage }}</p>
        <div class="alert-buttons">
          <button class="btn btn-primary" @click="confirmDelete">확인</button>
          <button class="btn btn-secondary" @click="cancelDelete">취소</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useBudgetStore } from '@/stores/budget';
import EditTransactionModal from '@/components/EditTransactionModal.vue';

const store = useBudgetStore();
const route = useRoute();
const router = useRouter();

const transaction = ref(null);
const showEdit = ref(false);
const showAlertModal = ref(false);
const alertMessage = ref('');

const transactionId = route.params.id;

// 거래 상세 불러오기
onMounted(async () => {
  await store.fetchTransactions();
  const found = store.transactions.find((t) => t.id == transactionId);
  if (found) {
    transaction.value = found;
  } else {
    alert('해당 거래를 찾을 수 없습니다.');
    router.push('/transactions');
  }
});

// 삭제 기능
const handleDelete = () => {
  alertMessage.value = '정말 삭제하실거에요?';
  showAlertModal.value = true;
};

const confirmDelete = async () => {
  await store.deleteTransaction(transactionId);
  showAlertModal.value = false;
  router.push('/transactions');
};

const cancelDelete = () => {
  showAlertModal.value = false;
};

// 수정 기능
const handleUpdate = async () => {
  await store.fetchTransactions();
  const updated = store.transactions.find((t) => t.id == transactionId);
  if (updated) {
    transaction.value = updated;
  }
  showEdit.value = false;
};

// 뒤로가기
const goBack = () => {
  router.back();
};

// 금액 포맷팅
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('ko-KR').format(amount);
};
</script>

<style scoped>
.detail-view {
  height: 100%;
  background-color: #fff;
}

.transaction-text {
  font-size: 1.25rem;
  font-weight: 500;
}

.transaction-detail {
  padding: 20px;
}

.detail-item {
  padding: 20px 0;
  border-bottom: 1px solid #eee;
}

.detail-item:last-child {
  border-bottom: none;
}

.item-label {
  color: #666;
  font-size: 0.9rem;
  margin-bottom: 8px;
}

.item-content {
  font-size: 1.2rem;
  font-weight: 500;
}

.amount {
  font-size: 1.5rem;
  font-weight: 600;
}

.btn-group .btn {
  flex: 1;
  padding: 12px;
  border: 1px solid #0d6efd;
  color: #0d6efd;
}

.btn-group .btn.btn-primary:hover {
  background-color: #0d6efd;
  color: white;
}

.btn-group .btn.btn-danger:hover {
  background-color: #0d6efd;
  color: white;
}

.btn-group .btn:not(.btn-primary) {
  background-color: white;
}

.btn-group .btn:not(.btn-danger) {
  background-color: white;
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
  width: 80%;
  max-width: 300px;
  text-align: center;
}

.alert-message {
  margin-bottom: 20px;
  font-size: 16px;
}

.alert-buttons {
  display: flex;
  gap: 10px;
  justify-content: center;
}

.alert-buttons .btn {
  flex: 1;
  padding: 8px;
}
</style>
