<script setup>
import { ref } from 'vue';
import AddTransactionModal from '../components/AddTransactionModal.vue';
import TransactionListView from '../components/TransactionListView.vue';
import CalanderView from '../components/CalanderView.vue';

const showAddModal = ref(false);
const currentView = ref('list');
</script>

<template>
  <div class="transactions-view">
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
        @click="currentView = 'calendar'"
      >
        달력보기
      </div>
    </div>

    <TransactionListView v-if="currentView === 'list'" />
    <CalanderView v-else />

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
</style>
