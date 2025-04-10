<template>
  <div class="modal fade show d-block" tabindex="-1" role="dialog" v-if="show">
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">저축 내역</h5>
          <button
            type="button"
            class="btn-close"
            @click="$emit('close')"
          ></button>
        </div>
        <div class="modal-body">
          <ul class="list-group">
            <li
              v-for="(item, index) in savings"
              :key="index"
              class="list-group-item d-flex justify-content-between"
            >
              <span>{{ formatDate(item.date) }}</span>
              <span>{{ formatCurrency(item.amount) }}원</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useBudgetStore } from '../stores/budget';
const budgetStore = useBudgetStore();
const savings = computed(() => budgetStore.transactionsByGoal);

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

defineProps({
  show: Boolean,
  savings: Array,
});
</script>

<style scoped>
.modal {
  background-color: rgba(0, 0, 0, 0.5);
}
</style>
