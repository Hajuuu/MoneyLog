<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useBudgetStore } from '@/stores/budget';
import AddTransactionModal from '../components/AddTransactionModal.vue';

const router = useRouter();
const budgetStore = useBudgetStore();

const showAddModal = ref(false);
const filterType = ref('all');
const sortOrder = ref('latest');
const amountOrder = ref('high');
const showFilterModal = ref(false);
const currentDate = ref(new Date());
const availableMonths = ref([]);
const currentView = ref('list');

// 거래내역 불러오기
const fetchTransactions = async () => {
  try {
    await budgetStore.fetchTransaction();
  } catch (error) {
    console.error('거래내역을 불러오는데 실패했습니다:', error);
  }
};

// 스크롤 이벤트 핸들러 (거래내역 스크롤)
const handleScroll = (e) => {
  const element = e.target;
  if (element.scrollHeight - element.scrollTop <= element.clientHeight + 100) {
    fetchTransactions();
  }
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

// 특정 월 선택
const selectMonth = (date) => {
  currentDate.value = new Date(date);
  showMonthModal.value = false;
  fetchTransactions();
};

// 필터 변경
const changeFilter = (type) => {
  filterType.value = type;
  // 필터 변경 시 금액 정렬 초기화
  if (type === 'all') {
    amountOrder.value = 'none';
  } else {
    amountOrder.value = 'high'; // 수입/지출 선택 시 기본값은 고액순
  }
  showFilterModal.value = false;
};

// 정렬 순서 변경
const toggleSortOrder = () => {
  sortOrder.value = sortOrder.value === 'latest' ? 'oldest' : 'latest';
  // 날짜순 정렬 시 금액 정렬 해제
  amountOrder.value = 'none';
};

// 금액 정렬 순서 변경
const toggleAmountOrder = () => {
  if (amountOrder.value === 'none') {
    amountOrder.value = 'high';
  } else {
    amountOrder.value = amountOrder.value === 'high' ? 'low' : 'high';
  }
  // 금액순 정렬 시 날짜 정렬은 최신순으로 초기화
  sortOrder.value = 'latest';
};

// 정렬 텍스트 계산
const sortOrderText = computed(() =>
  sortOrder.value === 'latest' ? '최신순' : '과거순'
);
const amountOrderText = computed(() =>
  amountOrder.value === 'high' ? '고액순' : '소액순'
);

// 거래내역 필터링 및 정렬
const myFilter = computed(() => {
  let filtered = [...budgetStore.transactions];

  // 타입 필터링
  if (filterType.value !== 'all') {
    filtered = filtered.filter((t) => t.type === filterType.value);
  }

  // 금액순 정렬이 활성화된 경우
  if (amountOrder.value !== 'none' && filterType.value !== 'all') {
    filtered.sort((a, b) => {
      return amountOrder.value === 'high' ? b.amount - a.amount : a.amount - b.amount;
    });
  } else {
    // 날짜순 정렬
    filtered.sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return sortOrder.value === 'latest' ? dateB - dateA : dateA - dateB;
    });
  }
  return filtered;
});

const handleCalendarView = () => {
  currentView.value = 'calendar';
  // 나중에 달력 뷰로 라우팅 구현
  // router.push('/calendar');
};

onMounted(() => {
  fetchTransactions();
});
</script>

<template>
  <div class="transactions-view" @scroll="handleScroll">
    <header class="d-flex justify-content-between align-items-center p-3 border-bottom">
      <h2 class="transaction-text mb-0">거래 내역</h2>
      <button class="btn btn-link" @click="showAddModal = true">
        <i class="fas fa-plus"></i>
      </button>
    </header>

    <div class="view-selector">
      <div
        class="view-option"
        :class="{ active: currentView === 'list' }"
        @click="currentView = 'list'"
      >
        목록보기
      </div>
      <div
        class="view-option"
        :class="{ active: currentView === 'calendar' }"
        @click="handleCalendarView"
      >
        달력보기
      </div>
    </div>

    <div class="filter-section p-3 border-bottom">
      <div class="d-flex justify-content-between align-items-center mb-2">
        <div class="filter-buttons">
          <button class="btn btn-outline-primary me-2" @click="showFilterModal = true">
            {{
              filterType === 'all' ? '전체' : filterType === 'income' ? '수입' : '지출'
            }}
          </button>
          <button class="btn btn-outline-primary me-2" @click="toggleSortOrder">
            {{ sortOrderText }}
          </button>
          <button
            v-if="filterType !== 'all'"
            class="btn btn-outline-primary"
            @click="toggleAmountOrder"
          >
            {{ amountOrderText }}
          </button>
        </div>
        <button class="btn btn-link" @click="router.push('/monthly-transactions')">
          <i class="fas fa-search"></i>
        </button>
      </div>
    </div>

    <div class="transactions-list">
      <div
        v-for="transaction in myFilter"
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

    <!-- 필터 모달 -->
    <Teleport to="body">
      <div
        class="filter-modal"
        v-if="showFilterModal"
        @click.self="showFilterModal = false"
      >
        <div class="filter-modal-content">
          <div class="list-group">
            <button class="list-group-item" @click="changeFilter('all')">전체</button>
            <button class="list-group-item" @click="changeFilter('income')">수입</button>
            <button class="list-group-item" @click="changeFilter('expense')">지출</button>
          </div>
        </div>
      </div>
    </Teleport>
    <!-- 거래내역 추가 모달 -->
    <AddTransactionModal v-if="showAddModal" @close="showAddModal = false" />
  </div>
</template>

<style scoped>
.transactions-view {
  height: 100%;
  overflow-y: auto;
  padding-bottom: 60px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  background-color: white;
  border-bottom: 1px solid #eee;
}

.transaction-text {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 500;
}

.view-selector {
  display: flex;
  justify-content: center;
  gap: 32px;
  padding: 12px 0;
  border-bottom: 1px solid #eee;
}

.view-option {
  position: relative;
  padding: 8px 4px;
  cursor: pointer;
}

.view-option.active::after {
  content: '';
  position: absolute;
  bottom: -12px;
  left: 0;
  width: 100%;
  height: 2px;
  background-color: #000;
}

.btn-link {
  color: #333;
  text-decoration: none;
  padding: 0;
}

.btn-link:hover {
  color: #007bff;
}

.filter-section {
  background-color: white;
  position: sticky;
  top: 0;
  z-index: 1;
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

.filter-modal {
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

.filter-modal-content {
  background-color: white;
  width: 100%;
  height: 200px;
  max-width: 430px;
  margin: 0 auto;
  border-top-left-radius: 16px;
  border-top-right-radius: 16px;
  padding: 20px;
  margin-bottom: 60px;
}

.list-group-item {
  border: none;
  padding: 15px;
  cursor: pointer;
  text-align: center;
  transition: background-color 0.2s;
}

.list-group-item:hover {
  background-color: #f8f9fa;
  color: #1c6af9;
}
</style>
