<script setup>
import { useRouter } from 'vue-router';
import { useBudgetStore } from '@/stores/budget';
import { storeToRefs } from 'pinia';
import { onMounted, ref, computed } from 'vue';
import dayjs from 'dayjs';

const now = dayjs();
const month = now.format('MMMM');
const year = now.format('YYYY');
const budgetStore = useBudgetStore();
const { transactions } = storeToRefs(budgetStore);
onMounted(async () => {
  await budgetStore.fetchTransaction();
  await budgetStore.fetchCategories();
});

const currentMonth = ref(new Date().toISOString().slice(0, 7));
const selectedDate = ref('');
const newTransaction = ref({
  type: 'expense',
  category: '',
  amount: '',
  memo: '',
});

const monthlyIncome = computed(() =>
  budgetStore.monthlyIncome(currentMonth.value)
);
const monthlyExpense = computed(() =>
  budgetStore.monthlyExpense(currentMonth.value)
);
const netIncome = computed(() => monthlyIncome.value - monthlyExpense.value);

const recentTransactions = computed(() => {
  return [...transactions.value]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5);
});

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('ko-KR', {
    style: 'currency',
    currency: 'KRW',
  }).format(amount);
};
const formatDate = (date) => {
  return new Date(date).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};
</script>

<template>
  <div class="home-view">
    <header class="d-flex justify-content-between align-items-center p-3">
      <h2 class="date-header mb-0">{{ month + ' ' + year }}</h2>
      <button class="btn btn-outline-dark rounded-circle add-button">
        <i class="fas fa-plus"></i>
      </button>
    </header>
    <div class="summary-cards px-3">
      <div class="d-flex gap-3 mb-3">
        <div class="card flex-fill square-card">
          <div class="card-body">
            <h6 class="card-subtitle mb-2 text-primary">수입</h6>
            <h3 class="card-title text-primary">
              {{ formatCurrency(monthlyIncome) }}
            </h3>
          </div>
        </div>

        <div class="card flex-fill square-card">
          <div class="card-body">
            <h6 class="card-subtitle mb-2 text-danger">지출</h6>
            <h3 class="card-title text-danger">
              {{ formatCurrency(monthlyExpense) }}
            </h3>
          </div>
        </div>
      </div>

      <div class="card mb-4">
        <div class="card-body">
          <h6 class="card-subtitle mb-2 text-success">잔액</h6>
          <h3 class="card-title text-success">
            {{ formatCurrency(netIncome) }}
          </h3>
        </div>
      </div>
    </div>

    <div class="recent-transactions px-3">
      <h5 class="mb-3">최근 거래내역</h5>
      <div class="card mb-2">
        <div
          class="card-body d-flex justify-content-between align-items-center py-2"
        >
          <div>
            <h6 class="mb-0">
              <tr
                v-for="transaction in recentTransactions"
                :key="transaction.id"
              >
                <td>{{ formatDate(transaction.date) }}</td>
                <td>
                  <span
                    :class="
                      transaction.type === 'income'
                        ? 'badge bg-success'
                        : 'badge bg-danger'
                    "
                  >
                    {{ transaction.type === 'income' ? '수입' : '지출' }}
                  </span>
                </td>
                <td
                  :class="
                    transaction.type === 'income'
                      ? 'text-success'
                      : 'text-danger'
                  "
                >
                  {{ formatCurrency(transaction.amount) }}
                </td>
                <td>{{ transaction.memo }}</td>
              </tr>
            </h6>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped>
.square-card {
  aspect-ratio: 1 / 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.card {
  border-radius: 12px;
  border: none;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
.card-subtitle {
  font-weight: 600;
}

.card-title {
  font-weight: 700;
  margin-bottom: 0;
}

.recent-transactions .card {
  transition: transform 0.2s;
}

.recent-transactions .card:hover {
  transform: translateY(-2px);
}
</style>
