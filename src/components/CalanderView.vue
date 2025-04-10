<template>
  <div class="calendar-wrapper">
    <v-calendar
      title-position="left"
      :attributes="dayEvents"
      is-expanded
      :hide-header="false"
      @dayclick="handleDateClick"
    >
      <template #day-content="{ day }">
        <div class="day-cell">
          <div class="day-number">{{ day.day }}</div>
          <div v-if="totals[day.id]" class="totals">
            <div v-if="totals[day.id].income" class="text-success">
              +{{ format(totals[day.id].income) }}
            </div>
            <div v-if="totals[day.id].expense" class="text-danger">
              -{{ format(totals[day.id].expense) }}
            </div>
          </div>
        </div>
      </template>
    </v-calendar>
  </div>
</template>

<script setup>
import { onMounted, computed } from 'vue';
import { useBudgetStore } from '@/stores/budget.js';

const emit = defineEmits(['select-date']);
const budgetStore = useBudgetStore();

onMounted(async () => {
  await budgetStore.fetchTransactions();
  console.log('✅ transactions loaded:', budgetStore.transactions);
  console.log('📅 totals:', totals.value);
});

const format = (val) => new Intl.NumberFormat('ko-KR').format(val);

// 날짜별 수입/지출 합계 계산
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

// 날짜 클릭 시 부모 컴포넌트로 emit
// const handleDateClick = ({ date }) => {
//   emit('select-date', date.toISOString().split('T')[0]);
// };
</script>
<style>
.vc-container,
.vc-pane-container {
  border: none !important;
  box-shadow: none !important;
  background: transparent !important;
}
.vc-container {
  width: 100% !important;
  max-width: 100% !important;
}

.vc-pane-container {
  width: 100% !important;
  max-width: 100% !important;
}

.calendar-wrapper {
  padding: 1rem;
  box-sizing: border-box;
  width: 100%;
  max-width: 480px;
  margin: 0 auto;
}

/* 날짜 셀 */
.day-cell {
  height: 80px;
  padding: 4px;
  display: flex;
  flex-direction: column;
  justify-content: center; /* 세로 중앙 */
  align-items: center; /* 가로 중앙 */
  text-align: center;
  font-size: 0.75rem;
  box-sizing: border-box;
  overflow: hidden;
}

/* 날짜 숫자 */
.day-number {
  font-weight: bold;
  font-size: 0.85rem;
  margin-bottom: 4px;
}

/* 수입/지출 영역 */
.totals {
  display: flex;
  flex-direction: column;
  gap: 2px;
  font-size: 0.7rem;
  line-height: 1.1;
  white-space: nowrap;
  text-align: center;
}

/* bootstrap 활용한 색상 */
.text-success {
  color: #1da84d !important;
}

.text-danger {
  color: #d7373f !important;
}

/* title부분의 색 변경 */
/* 화살표 버튼을 흰 배경으로 변경 */
.vc-arrow {
  background-color: white;
  color: #333;
  border: none;
  box-shadow: none;
  width: 28px;
  height: 28px;
  border-radius: 6px;
  transition: background-color 0.2s ease;
}

.vc-arrow:hover {
  background-color: #f0f0f0;
}

/* 상단 연도/월 텍스트 스타일 */
.vc-title {
  font-size: 1.1rem;
  font-weight: 700;
  color: #222;
  background-color: white;
}
</style>
