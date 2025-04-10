<template>
  <div class="calendar-wrapper">
    <v-calendar
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
}
.day-cell {
  padding: 4px;
  height: 80px;
  text-align: center;
  font-size: 0.75rem;
  box-sizing: border-box;
  word-break: keep-all;
  overflow: hidden; /* 내용이 넘치면 자르기 */
}

.day-number {
  font-weight: bold;
  margin-bottom: 4px;
}

.totals {
  font-size: 0.7rem;
  line-height: 1.2;
  white-space: pre-line;
}
</style>
