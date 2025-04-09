<script setup>
import { useRouter } from 'vue-router';
</script>

<template>
  <div class="home-view">
    <header class="d-flex justify-content-between align-items-center p-3">
      <h2 class="date-header mb-0">바인딩된 현재 월,년 끌어와 출력</h2>
      <button class="btn btn-outline-dark rounded-circle add-button">
        <i class="fas fa-plus"></i>
      </button>
    </header>
    <div class="summary-cards px-3">
      <div class="d-flex gap-3 mb-3">
        <div class="card flex-fill square-card">
          <div class="card-body">
            <h6 class="card-subtitle mb-2 text-primary">수입</h6>
            <h3 class="card-title text-primary">+ 10000원</h3>
          </div>
        </div>

        <div class="card flex-fill square-card">
          <div class="card-body">
            <h6 class="card-subtitle mb-2 text-danger">지출</h6>
            <h3 class="card-title text-danger">- 5000원</h3>
          </div>
        </div>
      </div>

      <div class="card mb-4">
        <div class="card-body">
          <h6 class="card-subtitle mb-2 text-success">잔액</h6>
          <h3 class="card-title text-success">222,222원</h3>
        </div>
      </div>
    </div>

    <div class="recent-transactions px-3">
      <h5 class="mb-3">최근 거래내역</h5>
      <div class="card mb-2">
        <div class="card-body d-flex justify-content-between align-items-center py-2">
          <div>
            <h6 class="mb-0">v-for 카테고리 출력</h6>
            <small class="text-muted">2025-04-09</small>
          </div>
          <div>111,111원</div>
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
