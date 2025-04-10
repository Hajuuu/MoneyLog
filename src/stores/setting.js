import { defineStore } from 'pinia';
import { settingAPI } from '@/api';

export const useSettingStore = defineStore('setting', {
  state: () => ({
    setting: {},
    error: null,
  }),

  getters: {
    getId: (state) => state.setting.id,
    getName: (state) => state.setting.name,
    getEmail: (state) => state.setting.email,
    getImage: (state) => state.setting.image,
  },

  actions: {
    async fetchSetting(id) {
      try {
        const response = await settingAPI.getSetting(id);
        this.setting = response.data;
      } catch (error) {
        this.error = error.message;
      }
    },

    async updateSetting(id, setting) {
      try {
        const response = await settingAPI.updateSetting(id, setting);
        this.setting = response.data;
        return response.data;
      } catch (error) {
        this.error = error.message;
        throw error;
      }
    },
  },
});
