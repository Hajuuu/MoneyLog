import { defineStore } from 'pinia';
import { goalAPI } from '@/api';

export const useGoalsStore = defineStore('goal', {
  state: () => ({
    goals: [],
    error: null,
  }),

  getters: {
    getAmount: (state) => state.goals.amount,
  },

  actions: {
    async fetchGoals() {
      try {
        const response = await goalAPI.getGoals();
        this.goals = response.data;
      } catch (error) {
        this.error = error.message;
      }
    },

    async addGoals(amount) {
      try {
        const response = await goalAPI.addGoals(amount);
        this.goals.push(response.data);
      } catch (error) {
        this.error = error.message;
        throw error;
      }
    },
  },
});
