import { defineStore } from 'pinia';
import { budgetAPI, categoryAPI } from '@/api';

export const useBudgetStore = defineStore('budget', {
  state: () => ({
    transactions: [],
    incomeCategories: [],
    expenseCategories: [],
    periodExpenses: [],
    error: null,
  }),

  getters: {
    getTransactionById: (state) => (id) => {
      return state.transactions.filter((t) => t.id === id);
    },
    incomeCategoryNames: (state) =>
      state.incomeCategories.map((category) => category.name),
    expenseCategoryNames: (state) =>
      state.expenseCategories.map((category) => category.name),

    monthlyIncome: (state) => (month) => {
      return state.transactions
        .filter((t) => t.type === 'income' && t.date.startsWith(month))
        .reduce((sum, t) => sum + t.amount, 0);
    },
    monthlyExpense: (state) => (month) => {
      return state.transactions
        .filter((t) => t.type === 'expense' && t.date.startsWith(month))
        .reduce((sum, t) => sum + t.amount, 0);
    },
    expenseByCategory: (state) => (month) => {
      const expenses = {};
      state.transactions
        .filter((t) => t.type === 'expense' && t.date.startsWith(month))
        .forEach((t) => {
          expenses[t.category] = (expenses[t.category] || 0) + t.amount;
        });
      return expenses;
    },
  },

  actions: {
    async fetchTransactions() {
      try {
        const response = await budgetAPI.getTransactions();
        this.transactions = response.data;
      } catch (error) {
        this.error = error.message;
      }
    },
    async fetchCategories() {
      try {
        const [incomeResponse, expenseResponse] = await Promise.all([
          categoryAPI.getIncomeCategories(),
          categoryAPI.getExpenseCategories(),
        ]);
        this.incomeCategories = incomeResponse.data;
        this.expenseCategories = expenseResponse.data;
      } catch (error) {
        this.error = error.message;
      }
    },

    async addTransaction(transaction) {
      try {
        const response = await budgetAPI.addTransaction(transaction);
        this.transactions.push(response.data);
        return response.data;
      } catch (error) {
        this.error = error.message;
        throw error;
      }
    },

    async updateTransaction(id, transaction) {
      try {
        const response = await budgetAPI.updateTransaction(id, transaction);
        const index = this.transactions.findIndex((t) => t.id === id);
        if (index !== -1) {
          this.transactions[index] = response.data;
        }
        return response.data;
      } catch (error) {
        this.error = error.message;
        throw error;
      }
    },

    async deleteTransaction(id) {
      try {
        await budgetAPI.deleteTransaction(id);
        this.transactions = this.transactions.filter((t) => t.id !== id);
      } catch (error) {
        this.error = error.message;
        throw error;
      }
    },

    async addCategory(type, name) {
      try {
        const response = await categoryAPI.addCategory(type, name);
        if (type === 'income') {
          this.incomeCategories.push(response.data);
        } else {
          this.expenseCategories.push(response.data);
        }
        return response.data;
      } catch (error) {
        this.error = error.message;
        throw error;
      }
    },

    async deleteCategory(type, id) {
      try {
        await categoryAPI.deleteCategory(type, id);
        if (type === 'income') {
          this.incomeCategories = this.incomeCategories.filter(
            (c) => c.id !== id
          );
        } else {
          this.expenseCategories = this.expenseCategories.filter(
            (c) => c.id !== id
          );
        }
      } catch (error) {
        this.error = error.message;
        throw error;
      }
    },
  },
});
