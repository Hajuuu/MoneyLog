<script setup>
import { useRouter } from 'vue-router';
import { useBudgetStore } from '@/stores/budget';
import { storeToRefs } from 'pinia';
import { onMounted, ref, computed } from 'vue';
import AddTransactionModal from '../components/AddTransactionModal.vue';

const budgetStore = useBudgetStore();
const { transactions } = storeToRefs(budgetStore);

const showAddModal = ref(false);
const showMonthModal = ref(false);

const currentDate = ref(new Date());
const selectedYear = ref(new Date().getFullYear());
const selectedMonth = ref(new Date().getMonth() + 1);
const isYearSelected = ref(false);

// 현재 월 계산
const currentMonth = computed(() => {
  const year = currentDate.value.getFullYear();
  const month = String(currentDate.value.getMonth() + 1).padStart(2, '0');
  return `${year}-${month}`;
});
// 현재 월의 수입과 지출 계산
const monthlyIncome = computed(() =>
  budgetStore.monthlyIncome(currentMonth.value)
);
const monthlyExpense = computed(() =>
  budgetStore.monthlyExpense(currentMonth.value)
);
const netIncome = computed(() => monthlyIncome.value - monthlyExpense.value);

// 최근 거래내역 4개 가져옴
const recentTransactions = computed(() => {
  return [...transactions.value]
    .filter((t) => t.date.startsWith(currentMonth.value))
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5);
});

// 금액 포맷팅
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('ko-KR').format(amount);
};

// 날짜 포맷팅
const formatDate = (date) => {
  return date.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
  });
};

// 최근 거래내역 일자 표시 위해 추가
const formatDateList = (date) => {
  return date.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

// 연 선택
const selectYear = (year) => {
  selectedYear.value = year;
  isYearSelected.value = true;
};
// 월 선택
const selectMonth = (month) => {
  selectedMonth.value = month;
  currentDate.value = new Date(selectedYear.value, month - 1);
  showMonthModal.value = false;
  isYearSelected.value = false;
};

onMounted(async () => {
  await budgetStore.fetchTransactions();
  await budgetStore.fetchCategories();
});
</script>

<template>
  <div class="home-view">
    <header class="d-flex justify-content-between align-items-center p-3">
      <h2 class="date-header mb-0" @click="showMonthModal = true">
        {{ formatDate(currentDate) }}
      </h2>
      <button class="btn btn-link" @click="showAddModal = true">
        <i class="fas fa-plus"></i>
      </button>
    </header>
    <div class="summary-cards px-3">
      <div class="d-flex gap-3 mb-3">
        <div class="card flex-fill square-card">
          <div class="card-body">
            <h6 class="card-subtitle mb-2 text-primary">수입</h6>
            <h5 class="card-title text-primary">
              +{{ formatCurrency(monthlyIncome) }}원
            </h5>
          </div>
        </div>

        <div class="card flex-fill square-card">
          <div class="card-body">
            <h6 class="card-subtitle mb-2 text-danger">지출</h6>
            <h5 class="card-title text-danger">
              -{{ formatCurrency(monthlyExpense) }}원
            </h5>
          </div>
        </div>
      </div>

      <div class="card mb-4">
        <div class="card-body">
          <h6 class="card-subtitle mb-2 text-success">순수익</h6>
          <h5 class="card-title text-success">
            {{ formatCurrency(netIncome) }}원
          </h5>
        </div>
      </div>
    </div>

    <div class="recent-transactions p-3">
      <h2 class="mb-3">최근 거래내역</h2>
      <div class="list-group">
        <div
          v-for="transaction in recentTransactions"
          :key="transaction.id"
          class="list-group-item"
        >
          <div class="d-flex justify-content-between align-items-center">
            <div>
              <div class="fw-bold">{{ transaction.category }}</div>
              <small class="text-muted">{{
                formatDateList(new Date(transaction.date))
              }}</small>
            </div>
            <div
              class="amount"
              :class="
                transaction.type === 'income' ? 'text-success' : 'text-danger'
              "
            >
              {{ transaction.type === 'income' ? '+' : '-'
              }}{{ formatCurrency(transaction.amount) }}원
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- 연월 선택 모달 -->
  <div
    class="month-modal"
    v-if="showMonthModal"
    @click.self="showMonthModal = false"
  >
    <div class="month-modal-content">
      <div class="year-selector">
        <div class="year-grid" v-if="!isYearSelected">
          <button
            v-for="year in Array.from(
              { length: 10 },
              (_, i) => new Date().getFullYear() - i
            )"
            :key="year"
            class="year-button"
            :class="{ selected: selectedYear === year }"
            @click="selectYear(year)"
          >
            {{ year }}년
          </button>
        </div>
        <div class="month-grid" v-else>
          <button
            v-for="month in 12"
            :key="month"
            class="month-button"
            :class="{ selected: selectedMonth === month }"
            @click="selectMonth(month)"
          >
            {{ month }}월
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- 거래내역 추가 모달 -->
  <AddTransactionModal v-if="showAddModal" @close="showAddModal = false" />
</template>

<style scoped>
.square-card {
  aspect-ratio: 1 / 0.5;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.home-view {
  height: 100%;
  overflow-y: auto;
  padding-bottom: 60px;
}

.date-header {
  font-size: 1.25rem;
  font-weight: 500;
  cursor: pointer;
}

.summary-card {
  background-color: #f8f9fa;
}

.card {
  border: none;
  border-radius: 12px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.card-body {
  padding: 1rem;
}

.card-subtitle {
  font-size: 0.875rem;
}

.card-title {
  font-size: 1.25rem;
  margin-bottom: 0;
}

.recent-transactions {
  background-color: white;
}

.list-group-item {
  border: none;
  border-bottom: 1px solid #dee2e6;
  padding: 1rem;
}

.list-group-item .fw-bold {
  margin-bottom: 0.5rem;
  padding: 0.5rem;
}

.amount {
  font-weight: 500;
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
  max-width: 430px;
  margin: 0 auto;
  border-top-left-radius: 16px;
  border-top-right-radius: 16px;
  padding: 20px;
  margin-bottom: 60px;
}

.year-selector {
  margin-bottom: 20px;
}

.year-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
}

.year-button {
  padding: 15px;
  border: 1px solid #dee2e6;
  border-radius: 8px;
  background-color: white;
  cursor: pointer;
  transition: all 0.2s;
}

.year-button:hover {
  background-color: #f8f9fa;
}

.year-button.selected {
  background-color: #0d6efd;
  color: white;
  border-color: #0d6efd;
}

.month-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
}

.month-button {
  padding: 15px;
  border: 1px solid #dee2e6;
  border-radius: 8px;
  background-color: white;
  cursor: pointer;
  transition: all 0.2s;
}

.month-button:hover {
  background-color: #f8f9fa;
}

.month-button.selected {
  background-color: #0d6efd;
  color: white;
  border-color: #0d6efd;
}

.modal-container {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1000;
}
</style>
