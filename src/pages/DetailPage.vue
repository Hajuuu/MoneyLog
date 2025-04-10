<template>
  <div class="container">
    <header
      class="d-flex justify-content-between align-items-center p-3 border-bottom"
    >
      <h2 class="date-header mb-0">거래 상세</h2>
    </header>

    <div v-if="transaction">
      <div>날짜</div>
      <div>{{ transaction.date }}</div>

      <div>카테고리</div>
      <div>{{ transaction.category }}</div>

      <div>금액</div>
      <div>{{ transaction.amount }}</div>

      <div>메모</div>
      <div>{{ transaction.memo }}</div>

      <div class="btn-group w-100 mb-4">
        <button class="btn btn-primary" @click="showEdit = true">수정</button>
        <button class="btn btn-danger" @click="handleDelete">삭제</button>
      </div>
    </div>

    <!-- 수정 모달 -->
    <EditTransactionModal
      v-if="showEdit"
      :transactionData="transaction"
      @close="showEdit = false"
      @update="handleUpdate"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useBudgetStore } from '@/stores/budget';
import EditTransactionModal from '@/components/EditTransactionModal.vue';

const store = useBudgetStore();
const route = useRoute();
const router = useRouter();

const transaction = ref(null);
const showEdit = ref(false);

const transactionId = route.params.id;

// 거래 상세 불러오기
onMounted(async () => {
  await store.fetchTransactions();
  const found = store.transactions.find((t) => t.id == transactionId);
  if (found) {
    transaction.value = found;
  } else {
    alert('해당 거래를 찾을 수 없습니다.');
    router.push('/transactions');
  }
});

// 삭제 기능
const handleDelete = async () => {
  if (confirm('정말 삭제하시겠습니까?')) {
    await store.deleteTransaction(transactionId);
    router.push('/transactions');
  }
};
// 수정 기능
const handleUpdate = async () => {
  await store.fetchTransactions(); // <- 거래 내역 다시 가져오기
  const updated = store.transactions.find((t) => t.id == transactionId);
  if (updated) {
    transaction.value = updated;
  }
  showEdit.value = false;
};
</script>

<style scoped>
.container {
  padding: 1rem;
}

.btn-group {
  display: flex;
  justify-content: space-between;
  margin-top: 1rem;
}

.btn {
  flex: 1;
  margin: 0 0.5rem;
}
</style>
