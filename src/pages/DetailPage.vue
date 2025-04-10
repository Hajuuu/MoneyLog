<template>
  <div class="container">
    <header
      class="d-flex justify-content-between align-items-center p-3 border-bottom"
    >
      <h2 class="date-header mb-0">거래 상세</h2>
    </header>
    <div>날짜</div>
    <div>{{ state.transaction?.date }}</div>
    <div>카테고리</div>
    <div>{{ state.transaction?.category }}</div>
    <div>금액</div>
    <div>{{ state.transaction?.amount }}</div>
    <div>메모</div>
    <div>{{ state.transaction?.memo }}</div>
    <div class="btn-group w-100 mb-4">
      <button class="btn" @click="handleTypeChange('income')">수정</button>
      <button class="btn" @click="handleTypeChange('expense')">삭제</button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, reactive } from 'vue';
import { useBudgetStore } from '@/stores/budget';
import { storeToRefs } from 'pinia';
import { useRoute } from 'vue-router';

const store = useBudgetStore();
const route = useRoute();
const transactionId = route.params.id;
const state = reactive({
  transaction: {},
});
onMounted(async () => {
  const transaction = await store.getTransactionById(transactionId);
  state.transaction = computed(() => transaction);
});
</script>
