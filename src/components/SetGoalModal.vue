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
const store = useGoalsStore();
const emit = defineEmits(['close']);

const currentAmount = ref({
  amount: '',
});

const addGoal = async () => {
  await store.addGoals({
    amount: parseInt(currentAmount.value.amount), // 목표 금액
  }); // 목표 금액 추가
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
  background-color: rgba(0, 0, 0, 0.5); /* 배경 어둡게 */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: #fff;
  padding: 30px 20px;
  border-radius: 12px;
  width: 300px; /* ✅ 작게 만듦 */
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
