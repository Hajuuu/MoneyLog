<template>
  <div class="modal-overlay">
    <div class="modal-content">
      <h3>목표 금액 입력</h3>
      <div class="mb-4">
        <label class="form-label"></label>
        <input
          v-model="currentAmount.amount"
          class="form-control"
          placeholder="금액을 입력하세요"
        />
      </div>
      <button class="btn btn-primary w-100" @click="addGoal">입력</button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useGoalsStore } from '@/stores/goal';
import { useToast } from 'vue-toastification';

const store = useGoalsStore();
const toast = useToast();
const emit = defineEmits(['close']);

const currentAmount = ref({
  amount: '',
});

const addGoal = async () => {
  const amount = parseInt(currentAmount.value.amount);

  if (
    isNaN(amount) ||
    parseInt(amount) <= 0 ||
    !/^[0-9]+$/.test(currentAmount.value.amount)
  ) {
    toast.error('올바른 목표 금액을 입력하세요');
    return;
  }
  await store.addGoals({ amount: parseInt(currentAmount.value.amount) });
  emit('close');
};
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: #fff;
  padding: 30px 20px;
  border-radius: 12px;
  width: 300px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  text-align: center;
}

input {
  padding: 8px;
  width: 200px;
  margin: 10px 0;
}
.btn-group button {
  margin: 5px;
  padding: 8px 16px;
}
</style>
