<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useBudgetStore } from '@/stores/budget';

const router = useRouter();
const budgetStore = useBudgetStore();

const transactions = ref([]);
const currentDate = ref(new Date());
const availableMonths = ref([]);
const showMonthModal = ref(false);

// 현재 년월 텍스트 출력
const currentMonthText = computed(() => {
  return `${currentDate.value.getFullYear()}년 ${currentDate.value.getMonth() + 1}월`;
});

// 거래내역 불러오기
const fetchTransactions = async () => {
  try {
    await budgetStore.fetchTransaction();
    const allTransactions = budgetStore.transactions;

    // 현재 선택된 월의 거래내역만 필터링
    const year = currentDate.value.getFullYear();
    const month = currentDate.value.getMonth();
    transactions.value = allTransactions
      .filter((transaction) => {
        const transactionDate = new Date(transaction.date);
        return (
          transactionDate.getFullYear() === year && transactionDate.getMonth() === month
        );
      })
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()); // 날짜 내림차순 정렬
    // 사용 가능한 월 목록 생성
    if (availableMonths.value.length === 0) {
      const dates = allTransactions.map((t) => new Date(t.date));
      const minDate = new Date(Math.min(...dates));
      const maxDate = new Date();

      const months = [];
      let currentDate = new Date(maxDate);
      currentDate.setDate(1); // 월의 첫날로 설정

      while (currentDate >= minDate) {
        months.push(new Date(currentDate));
        currentDate.setMonth(currentDate.getMonth() - 1);
      }

      availableMonths.value = months;
    }
  } catch (error) {
    console.error('거래내역을 불러오는데 실패했습니다:', error);
  }
};

// 이전 달로 이동
const previousMonth = () => {
  const newDate = new Date(currentDate.value);
  newDate.setMonth(newDate.getMonth() - 1);
  currentDate.value = newDate;
  fetchTransactions();
};

// 다음 달로 이동
const nextMonth = () => {
  const newDate = new Date(currentDate.value);
  newDate.setMonth(newDate.getMonth() + 1);
  if (newDate <= new Date()) {
    currentDate.value = newDate;
    fetchTransactions();
  }
};

// 특정 월 선택
const selectMonth = (date) => {
  currentDate.value = new Date(date);
  showMonthModal.value = false;
  fetchTransactions();
};

// 뒤로가기
const goBack = () => {
  router.back();
};

// 금액 포맷팅
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('ko-KR').format(amount);
};

// 날짜 포맷팅
const formatDate = (date) => {
  return new Date(date).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

onMounted(() => {
  fetchTransactions();
});
</script>

<template>
  <div class="monthly-transactions-view">
    <header class="d-flex justify-content-between align-items-center p-3 border-bottom">
      <button class="btn btn-link" @click="goBack">
        <i class="fas fa-arrow-left"></i>
      </button>
      <div class="month-selector d-flex align-items-center">
        <button class="btn btn-link" @click="previousMonth">
          <i class="fas fa-chevron-left"></i>
        </button>
        <button class="btn btn-link month-text" @click="showMonthModal = true">
          {{ currentMonthText }}
        </button>
        <button class="btn btn-link" @click="nextMonth">
          <i class="fas fa-chevron-right"></i>
        </button>
      </div>
      <div style="width: 24px"></div>
    </header>

    <div class="transactions-list">
      <div
        v-for="transaction in transactions"
        :key="transaction.id"
        class="transaction-item p-3 border-bottom"
      >
        <div class="d-flex justify-content-between align-items-center">
          <div class="d-flex align-items-center">
            <i
              class="fas fa-circle fa-xs me-3"
              :class="transaction.type === 'income' ? 'text-success' : 'text-danger'"
            >
            </i>
            <div>
              <div class="category-name">{{ transaction.category }}</div>
              <div class="transaction-date text-muted">
                {{ formatDate(transaction.date) }}
              </div>
            </div>
          </div>
          <div
            class="amount"
            :class="transaction.type === 'income' ? 'text-success' : 'text-danger'"
          >
            {{ transaction.type === 'income' ? '+' : '-'
            }}{{ formatCurrency(transaction.amount) }}원
          </div>
        </div>
      </div>
    </div>

    <!-- 월 선택 모달-->
    <div class="month-modal" v-if="showMonthModal" @click.self="showMonthModal = false">
      <div class="month-modal-content">
        <h5 class="text-center mb-3">월 선택</h5>
        <div class="month-list">
          <button
            v-for="date in availableMonths"
            :key="date.toISOString()"
            class="month-item"
            @click="selectMonth(date)"
          >
            {{ date.getFullYear() }}년 {{ date.getMonth() + 1 }}월
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.monthly-transactions-view {
  height: 100%;
  overflow-y: auto;
  padding-bottom: 60px;
}

.month-selector {
  gap: 8px;
}

.month-text {
  font-weight: 600;
  min-width: 120px;
  text-align: center;
}

.btn-link {
  color: #333;
  text-decoration: none;
  padding: 0;
}

.btn-link:hover {
  color: #007bff;
}

.month-modal {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  top: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: flex-end;
  z-index: 1000;
}

.month-modal-content {
  background-color: white;
  width: 100%;
  height: 500px;
  max-width: 430px;
  margin: 0 auto;
  border-top-left-radius: 16px;
  border-top-right-radius: 16px;
  padding: 20px;
  margin-bottom: 60px;
}

.month-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.month-item {
  border: none;
  background: none;
  padding: 15px;
  text-align: center;
  width: 100%;
  font-size: 1.1rem;
  transition: all 0.2s;
}

.month-item:hover {
  background-color: #f8f9fa;
  color: #007bff;
}

.transaction-item {
  transition: background-color 0.2s;
}

.transaction-item:hover {
  background-color: #f8f9fa;
}

.category-name {
  font-weight: 500;
  margin-bottom: 2px;
}

.transaction-date {
  font-size: 0.85rem;
}

.amount {
  font-weight: 600;
}
</style>
