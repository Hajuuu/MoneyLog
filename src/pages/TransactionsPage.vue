<script setup>
import { useRouter } from 'vue-router';
const router = useRouter();
const goToDetail = (id) => {
  router.push(`/transactions/detail/${id}`);
};
</script>

<template>
  <div class="transactions-view">
    <header class="header">
      <h2>거래 내역</h2>
    </header>

    <div class="view-selector">
      <div class="view-option">목록보기</div>
      <div class="view-option">달력보기</div>
    </div>

    <div class="filter-section p-3 border-bottom">
      <div class="d-flex justify-content-between align-items-center mb-2">
        <div class="filter-buttons">
          <button class="btn btn-outline-primary me-2">전체</button>
          <button class="btn btn-outline-primary me-2">과거</button>
          <button class="btn btn-outline-primary">고액순</button>
        </div>
        <button class="btn btn-link">
          <i class="fas fa-search"></i>
        </button>
      </div>
    </div>

    <div class="transactions-list">
      <div class="transaction-item p-3 border-bottom">
        <div class="d-flex justify-content-between align-items-center">
          <div class="d-flex align-items-center">
            <i class="fas fa-circle me-3"> </i>
            <div @click="goToDetail(2)">
              <div class="category-name">식비</div>
              <div class="transaction-date text-muted">2025-04-09</div>
            </div>
          </div>
          <div class="amount">+ 10,000원</div>
        </div>
      </div>
    </div>
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

.header h2 {
  margin: 0;
  font-size: 1.2rem;
  font-weight: 600;
}

.view-selector {
  display: flex;
  justify-content: center;
  gap: 120px;
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
</style>
