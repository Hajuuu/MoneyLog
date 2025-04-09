import axios from 'axios';

const BASE_URL = 'http://localhost:3000/';

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const budgetAPI = {
  getTransactions: () => api.get('/budget'),
  getIncomeTransactions: () => api.get('/budget?type=income'),
  getExpenseTransactions: () => api.get('/budget?type=expense'),
  addTransaction: (transaction) => api.post('/budget', transaction),
  updateTransaction: (id, transaction) => api.put(`/budget/${id}`, transaction),
  deleteTransaction: (id) => api.delete(`/budget/${id}`),
};

export const categoryAPI = {
  getIncomeCategories: () => api.get('/incomeCategories'),
  getExpenseCategories: () => api.get('/expenseCategories'),
  addCategory: (type, name) => api.post(`/${type}Categories`, { name }),
  deleteCategory: (type, id) => api.delete(`/${type}Categories/${id}`),
};

export const settingAPI = {
  getSetting: (id) => api.get(`/users/${id}`),
  updateSetting: (id, setting) => api.put(`/users/${id}`, setting),
};

export const goalAPI = {
  getGoals: () => api.get('/goals'),
  addGoals: () => api.post('/goals'),
};

export default api;
