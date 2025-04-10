<template>
  <div class="statistics-view">
    <header class="d-flex justify-content-between align-items-center p-3">
      <h2 class="statistics-header mb-0">통계 및 분석</h2>
    </header>
    <div class="select-section p-3 border-bottom">
      <div class="d-flex justify-content-between align-items-center mb-2">
        <div class="select-buttons btn-group w-100">
          <button
            class="btn"
            :class="currentView === 'daily' ? 'btn-primary' : 'btn-outline-primary'"
            @click="currentView = 'daily'"
          >
            일일 통계
          </button>
          <button
            class="btn"
            :class="currentView === 'monthly' ? 'btn-primary' : 'btn-outline-primary'"
            @click="currentView = 'monthly'"
          >
            월별 통계
          </button>
        </div>
      </div>
      <div class="chart-wrapper">
        <canvas ref="chartCanvas"></canvas>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { useBudgetStore } from '@/stores/budget';
import { Chart, registerables } from 'chart.js';
import { storeToRefs } from 'pinia';

const budgetStore = useBudgetStore();
const { transactions } = storeToRefs(budgetStore);

onMounted(async () => {
  await budgetStore.fetchTransactions();
  await budgetStore.fetchCategories();
});
Chart.register(...registerables);

const chartCanvas = ref(null);
const currentView = ref('daily');
let chartInstance = null;

// 오늘 날짜 계산
const today = new Date().toISOString().split('T')[0];
const currentMonth = today.slice(0, 7);

// 카테고리별 합계 추출 함수
const getChartData = (type) => {
  const _transactions = [...transactions.value];
  const filtered = _transactions.filter((item) => {
    const matchType = item.type === 'expense';
    const matchId = item.id !== '8';
    const matchDate =
      type === 'daily' ? item.date === today : item.date?.startsWith(currentMonth);

    return matchType && matchDate && matchId;
  });

  const categoryTotals = {};
  filtered.forEach((item) => {
    if (!categoryTotals[item.category]) {
      categoryTotals[item.category] = 0;
    }
    categoryTotals[item.category] += item.amount;
  });

  return {
    labels: Object.keys(categoryTotals),
    values: Object.values(categoryTotals),
  };
};

// 차트 렌더링 함수
const renderChart = () => {
  if (chartInstance) chartInstance.destroy();

  const ctx = chartCanvas.value.getContext('2d');
  const { labels, values } = getChartData(currentView.value);

  chartInstance = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels,
      datasets: [
        {
          label: '지출',
          data: values,
          backgroundColor: [
            '#FF6384',
            '#36A2EB',
            '#FFCE56',
            '#4BC0C0',
            '#9966FF',
            '#FF9F40',
          ],
          borderColor: '#fff',
          borderWidth: 2,
        },
      ],
    },
    options: {
      responsive: false,
      plugins: {
        legend: {
          position: 'bottom',
        },
      },
    },
  });
};

onMounted(() => {
  renderChart();
});

watch(currentView, () => {
  renderChart();
});
</script>

<style scoped>
.statistics-view {
  height: 100%;
  overflow-y: auto;
  padding-bottom: 60px;
}

.statistics-header {
  font-size: 1.25rem;
  font-weight: 500;
  cursor: pointer;
}

.btn-link {
  color: #333;
  text-decoration: none;
  padding: 0;
}

.btn-link:hover {
  color: #007bff;
}

.select-buttons .btn {
  flex: 1;
  padding: 12px;
  border: 1px solid #0d6efd;
  color: #0d6efd;
  min-width: 100px;
}

.select-buttons .btn.btn-primary {
  background-color: #0d6efd;
  color: white;
}

.select-buttons .btn:not(.btn-primary) {
  background-color: white;
}

.chart-wrapper {
  width: 400px;
  height: 400px;
  margin: 100px auto;
}

canvas {
  width: 100% !important;
  height: 100% !important;
}
</style>
