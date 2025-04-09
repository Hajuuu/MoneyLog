import { defineStore } from 'pinia';
import { settingAPI } from '@/api';

export const useSettingStore = defineStore('setting', {
  state: () => ({
    setting: [],
    error: null,
  }),

  getters: {
    getName: (state) => state.setting.name,
    getEmail: (state) => state.setting.email,
    getImage: (state) => state.setting.image,
  },

  actions: {
    async fetchSetting() {
      try {
        const response = await settingAPI.getSetting();
        this.setting = response.data;
      } catch (error) {
        this.error = error.message;
      }
    },
  },

  async updateSetting(id, setting) {
    try {
      const response = await settingAPI.updateSetting(id, setting);
      const index = this.setting.findIndex((t) => t.id === id);
      if (index !== -1) {
        this.transactions[index] = response.data;
      }
      return response.data;
    } catch (error) {
      this.error = error.message;
      throw error;
    }
  },
});
