<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useBudgetStore } from '@/stores/budget';

const route = useRoute();
const router = useRouter();
const budgetStore = useBudgetStore();

const transaction = ref(null);

// 거래내역 상세 정보 불러오기
const fetchTransactionDetail = async () => {
  try {
    await budgetStore.fetchTransactions();
    const foundTransaction = budgetStore.transactions.find(
      (t) => t.id == route.params.id
    );
    if (foundTransaction) {
      transaction.value = foundTransaction;
    } else {
      console.error('거래내역을 찾을 수 없습니다.');
      router.push('/transactions');
    }
  } catch (error) {
    console.error('거래내역을 불러오는데 실패했습니다:', error);
    router.push('/transactions');
  }
};

// 뒤로가기
const goBack = () => {
  router.back();
};

// 수정하기
const editTransaction = () => {
  // 수정 페이지로 이동 ... 만들어야함
  router.push(`/transactions/edit/${route.params.id}`);
};

// 삭제하기
const deleteTransaction = async () => {
  if (confirm('정말 삭제하시겠습니까?')) {
    try {
      await budgetStore.deleteTransaction(route.params.id);
      router.push('/transactions');
    } catch (error) {
      console.error('거래내역 삭제 실패:', error);
    }
  }
};

// 금액 포맷팅
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('ko-KR').format(amount);
};

onMounted(() => {
  fetchTransactionDetail();
});
</script>

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
        <button class="btn btn-primary btn1" @click="editTransaction">수정</button>
        <button class="btn btn-danger btn2" @click="deleteTransaction">삭제</button>
      </div>
    </div>
  </div>
</template>

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

.button-group {
  display: flex;
  gap: 50px;
  padding: 20px;
  position: fixed;
  bottom: 100px;
  left: 0;
  right: 0;
  background: #fff;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
}

/* 버튼 그룹 스타일링 */
.btn-group {
  display: flex;
  gap: 40px;
}

.btn-group .btn {
  /* flex: 1; */
  padding: 12px;
  border-radius: 10px 10px 10px 10px;
}
</style>
