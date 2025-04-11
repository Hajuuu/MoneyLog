<template>
  <div class="calendar-view">
    <!-- 기존 달력 -->
    <div class="calendar-wrapper">
      <v-calendar title-position="left" :attributes="[]" is-expanded :hide-header="false">
        <template #day-content="{ day }">
          <div
            class="day-cell"
            :class="{ selected: selectedDate === day.id }"
            @click="handleDateClick({ date: day.date })"
          >
            <div class="day-number" :class="{ 'selected-date': selectedDate === day.id }">
              {{ day.day }}
            </div>
            <div class="totals">
              <div v-if="totals[day.id] && totals[day.id].income" class="text-success">
                +{{ formatCurrency(totals[day.id].income) }}
              </div>
              <div v-if="totals[day.id] && totals[day.id].expense" class="text-danger">
                -{{ formatCurrency(totals[day.id].expense) }}
              </div>
            </div>
          </div>
        </template>
      </v-calendar>
    </div>

    <!-- 아래쪽 거래 내역 리스트 -->
    <div class="transaction-list mt-4">
      <h4 class="text-center mb-3">{{ selectedDate }} 거래 내역</h4>
      <div v-if="filteredTransactions.length">
        <div
          class="custom-transaction mb-3"
          v-for="tx in filteredTransactions"
          :key="tx.id"
        >
          <div class="custom-icon">
            <i
              class="fas fa-circle fa-xs me-3 smaller-icon"
              :class="tx.type === 'income' ? 'text-success' : 'text-danger'"
            >
            </i>
          </div>
          <div class="custom-text">
            <div
              class="custom-amount"
              :class="tx.type === 'income' ? 'text-success' : 'text-danger'"
            >
              {{ tx.type === 'income' ? '+' : '-' }}{{ formatCurrency(tx.amount) }}원
            </div>
            <div class="custom-memo">
              {{ tx.category }} | {{ tx.memo || '내용 없음' }}
            </div>
          </div>
        </div>
      </div>
      <div v-else class="text-center mt-3 text-muted">
        해당 날짜에 거래 내역이 없습니다.
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, computed, onMounted } from 'vue';
import { useBudgetStore } from '@/stores/budget';
import { format } from 'date-fns';

const emit = defineEmits(['select-date']);
const budgetStore = useBudgetStore();

const selectedDate = ref(format(new Date(), 'yyyy-MM-dd'));

const filteredTransactions = computed(() => {
  return budgetStore.transactions.filter(
    (tx) => format(new Date(tx.date), 'yyyy-MM-dd') === selectedDate.value
  );
});

// 금액 포맷팅
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('ko-KR').format(amount);
};

const handleDateClick = ({ date }) => {
  selectedDate.value = format(date, 'yyyy-MM-dd');
  emit('select-date', selectedDate.value);
};

onMounted(() => {
  budgetStore.fetchTransactions();
});

const totals = computed(() => {
  const map = {};
  budgetStore.transactions.forEach((t) => {
    const date = t.date;
    if (!map[date]) map[date] = { income: 0, expense: 0 };
    if (t.type === 'income') {
      map[date].income += t.amount;
    } else {
      map[date].expense += t.amount;
    }
  });
  return map;
});
</script>

<style scoped>
.calendar-view {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1rem;
}

.calendar-wrapper {
  width: calc(100% - 2rem); /* app-wrapper보다 좌우 1rem씩 작게 설정 */
  max-width: 480px;
  overflow: hidden;
}

.calendar-wrapper :deep(.vc-container) {
  max-width: 100%;
  height: auto;
  width: 100%; /* 고정 너비 설정 */
}

.calendar-wrapper :deep(.vc-weeks) {
  overflow: hidden;
  width: 100%; /* 주간 영역 너비 고정 */
}

.calendar-wrapper :deep(.vc-pane-container) {
  width: 100%; /* 패널 컨테이너 너비 고정 */
  min-width: 100%;
}

/* 캘린더 헤더와 이동 버튼 배경 제거 */
.calendar-wrapper :deep(.vc-header) {
  background: transparent;
}

.calendar-wrapper :deep(.vc-arrow) {
  background: transparent;
  border: none;
}

.calendar-wrapper :deep(.vc-title) {
  background: transparent;
  border: none;
}

.transaction-list {
  width: 100%;
  max-width: 480px;
  margin-top: 1rem;
}

.custom-transaction {
  display: flex;
  align-items: flex-start;
  background-color: white;
  color: black;
  border-radius: 0.75rem;
  padding: 0.75rem 1rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  gap: 1rem;
}

.custom-icon {
  font-size: 1.5rem;
  color: #bbb;
  padding-top: 0.25rem;
}

.custom-text {
  flex: 1;
}

.custom-amount {
  font-weight: bold;
  font-size: 1rem;
  margin-bottom: 0.25rem;
}

.custom-memo {
  font-size: 0.85rem;
  color: #ccc;
}

.day-cell {
  height: 60px;
  padding: 4px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  font-size: 0.75rem;
  box-sizing: border-box;
}

.day-number {
  font-weight: bold;
  font-size: 0.85rem;
  margin-bottom: 2px;
  min-height: 18px;
  line-height: 1;
}

.totals {
  min-height: 30px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  gap: 2px;
  font-size: 0.7rem;
  line-height: 1.1;
  white-space: nowrap;
  text-align: center;
}

.text-success {
  color: #1da84d !important;
}

.text-danger {
  color: #d7373f !important;
}

.smaller-icon {
  font-size: 0.65rem;
}

/* 내가 선택한 날짜 표시하는것 */
.day-number.selected-date {
  background-color: #0d6efd;
  color: white;
  border-radius: 999px;
  padding: 4px 8px;
}
</style>
