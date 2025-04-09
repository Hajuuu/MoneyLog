<template>
  <div>
    <h1>통계 및 분석</h1>
    <div>
      <button @click="currentView = 'daily'">일</button>
      <button @click="currentView = 'monthly'">월</button>
    </div>
  </div>
  <div class="chart-wrapper">
    <canvas ref="chartCanvas"></canvas>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

const chartCanvas = ref(null);
const currentView = ref('daily');
let chartInstance = null;

// 오늘 날짜 계산
const today = new Date().toISOString().split('T')[0];
const currentMonth = today.slice(0, 7);

// JSON 데이터 (예시로 직접 정의했지만 실제론 API나 import로 불러올 수도 있음)
const db = {
  budget: [
    {
      id: '1',
      date: '2025-04-01',
      type: 'income',
      category: '월급',
      amount: 3000000,
      memo: '4월 급여',
    },
    {
      id: '2',
      date: '2025-04-02',
      type: 'expense',
      category: '식비',
      amount: 15000,
      memo: '점심식사',
    },
    {
      id: '6ef9',
      date: '2025-04-06',
      type: 'expense',
      category: '주거비',
      amount: 5000000,
      memo: '월세',
    },
    {
      id: '8d20',
      date: '2025-04-04',
      type: 'expense',
      category: '통신비',
      amount: 110000,
      memo: '통신비에용',
    },
    {
      id: 'ea01',
      date: '2025-04-05',
      type: 'expense',
      category: '식비',
      amount: 15900,
      memo: '밥먹었어용',
    },
    {
      id: '4587',
      date: '2025-04-02',
      type: 'expense',
      category: '의료비',
      amount: 12500,
      memo: '아야했어요',
    },
    {
      id: '2c8a',
      date: '2025-04-09',
      type: 'expense',
      category: '통신비',
      amount: 120000,
      memo: 'aaa',
    },
  ],
};

// 카테고리별 합계 추출 함수
const getChartData = (type) => {
  const filtered = db.budget.filter((item) => {
    const matchType = item.type === 'expense';
    const matchId = item.id !== '8';
    const matchDate =
      type === 'daily'
        ? item.date === today
        : item.date?.startsWith(currentMonth);

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
