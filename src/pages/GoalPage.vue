<script setup>
import { ref, computed, onMounted } from 'vue';
import { useGoalsStore } from '@/stores/goal';
import SavingModal from '@/components/SavingModal.vue';
import SetModal from '@/components/SetGoalModal.vue';
import noGoalImage from '@/assets/images/noo_goal.png';
import { storeToRefs } from 'pinia';
import { useBudgetStore } from '../stores/budget';

const budgetStore = useBudgetStore();
const totalSavingAmount = computed(() => budgetStore.totalGoal);

const isSetModalVisible = ref(false); // 목표 금액 설정 모달 표시 여부
const isModalVisible = ref(false); // 거래 내역 모달 표시 여부
const store = useGoalsStore();
const currentAmount = ref({
  amount: '',
});
const { goals } = storeToRefs(store);

const goalAmount = computed(() => {
  if (goals.value.length === 0) return { amount: 0 };
  return goals.value.slice(-1)[0];
});

const animatedPercentage = ref(0);
const showMessage = ref(false);
const messageText = ref('');

const percentage = computed(() => {
  const current = Number(currentAmount.value.amount);
  const goal = Number(goalAmount.value.amount);
  if (!goal || isNaN(current)) return 0;
  return Math.min((current / goal) * 100);
});

const pigImage = computed(() => {
  const percent = percentage.value;
  if (percent < 25) return 'src/assets/images/poor_pig.png';
  if (percent < 50) return 'src/assets/images/pig.svg';
  if (percent < 75) return 'src/assets/images/over_goal_pig.png';
  return 'src/assets/images/rich_pig.png';
});

const animatePercentage = () => {
  const target = percentage.value;
  const step = target / 10;

  const interval = setInterval(() => {
    if (animatedPercentage.value < target) {
      animatedPercentage.value = Math.min(
        animatedPercentage.value + step,
        target
      );
    } else {
      clearInterval(interval);

      messageText.value = `${Math.floor(target)}%를 달성했어요!`;
      showMessage.value = true;

      setTimeout(() => {
        showMessage.value = false;
      }, 2000);
    }
  }, 16);
};

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

onMounted(async () => {
  await store.fetchGoals(); // axios로 json-server 불러옴
  await budgetStore.fetchTransactions();
  currentAmount.value.amount = totalSavingAmount.value;
  animatePercentage();
});
</script>

<template>
  <div class="goal-view">
    <!-- 돼지 누르면 모달 띄우기 -->
    <SetModal
      v-if="isSetModalVisible"
      v-model:show="isSetModalVisible"
      @close="isSetModalVisible = false"
    />

    <div v-if="goalAmount.amount == 0" class="container">
      >
      <img
        src="@/assets/images/money-bag.png"
        alt="money-bag"
        style="width: 100px; margin-bottom: 20px"
      />
      <img
        :src="noGoalImage"
        alt="nogoal"
        @click="isSetModalVisible = true"
        style="cursor: pointer; width: 300px"
      />
      <h2 class="goal-title">목표 금액이 없습니다!</h2>
    </div>

    <div v-else class="goal-box">
      <h2 class="goal-title">저축 목표</h2>

      <div
        v-if="percentage >= 100"
        class="new_set"
        style="background-color: #fff3cd; color: #664d03"
      >
        🥳 목표 금액을 다 모았어요 🥳
        <button
          @click="isSetModalVisible = true"
          @submit="addGoal"
          style="
            margin-top: 10px;
            margin-left: 10px;
            padding: 4px 8px;
            border: none;
            background-color: #f0ad4e;
            color: white;
            border-radius: 6px;
          "
        >
          목표 다시 설정하기
        </button>
      </div>

      <div class="mb-3 fw-bold">
        목표 금액: {{ formatCurrency(goalAmount.amount) }}원
      </div>
      <div class="progress mb-3">
        <div
          class="progress-bar bg-success"
          role="progressbar"
          :style="{ width: '100%' }"
          aria-valuenow="100"
          aria-valuemin="0"
          aria-valuemax="100"
        ></div>
      </div>

      <div class="mb-2 fw-bold">
        현재 금액: {{ formatCurrency(totalSavingAmount) }}원
      </div>

      <div class="progress mb-3">
        <div
          class="progress-bar"
          role="progressbar"
          :style="{
            width: percentage + '%',
            backgroundColor: '#42a5f5',
          }"
          :aria-valuenow="animatedPercentage"
          aria-valuemin="0"
          aria-valuemax="100"
        ></div>
      </div>

      <div class="h4 fw-bold" style="font-family: 'Pretendard', sans-serif">
        {{ Math.floor(percentage) }}%
      </div>

      <img
        :src="pigImage"
        alt="Piggy"
        class="pig-img"
        @click="isModalVisible = true"
      />

      <div v-if="showMessage" class="alert-message">
        {{ messageText }}
      </div>

      <!-- 거래 상세 보여주는 모달 -->
      <SavingModal
        v-if="isModalVisible"
        :show="isModalVisible"
        :savings="savingsHistory"
        @close="isModalVisible = false"
      />
    </div>
  </div>
</template>

<style scoped>
.goal-view {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh; /* 화면 전체 높이 */
}

.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  height: 80vh;
}
.goal-title {
  font-size: 1.75rem;
  font-family: 'Pretendard', sans-serif;
  font-weight: 700;
  margin-top: 30px;
  margin-bottom: 30px;
}
.new_set {
  padding: 10px;
  border-radius: 10px;
  margin-bottom: 20px;
  font-size: 1rem;
  font-weight: bold;
}

.goal-box {
  max-width: 700px;
  margin: 50px auto;
  padding: 50px;
  min-height: 600px;
  background: white;
  border-radius: 20px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  text-align: center;
}
.progress {
  height: 20px;
  background-color: #eee;
  border-radius: 10px;
  overflow: hidden;
}
.progress-bar {
  transition: width 0.6s ease-in-out;
}
.pig-img {
  width: 250px;
  margin-top: 30px;
}
.pig-img:hover {
  transform: scale(1.15);
}

.alert-message {
  background-color: #d1e7dd;
  color: #0f5132;
  padding: 10px 20px;
  border-radius: 12px;
  margin-bottom: 16px;
  font-weight: bold;
  font-size: 1rem;
  animation: fadeInOut 2s ease-in-out;
}

@keyframes fadeInOut {
  0% {
    opacity: 0;
    transform: translateY(-10px);
  }
  10% {
    opacity: 1;
    transform: translateY(0);
  }
  90% {
    opacity: 1;
    transform: translateY(0);
  }
  100% {
    opacity: 0;
    transform: translateY(-10px);
  }
}
</style>
