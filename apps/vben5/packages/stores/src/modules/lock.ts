import { defineStore } from 'pinia';

interface AppState {
  /**
   * Trạng thái khoá màn hình hay không
   */
  isLockScreen: boolean;
  /**
   * Mật khẩu khoá màn hình
   */
  lockScreenPassword?: string;
}

export const useLockStore = defineStore('core-lock', {
  actions: {
    lockScreen(password: string) {
      this.isLockScreen = true;
      this.lockScreenPassword = password;
    },

    unlockScreen() {
      this.isLockScreen = false;
      this.lockScreenPassword = undefined;
    },
  },
  persist: {
    pick: ['isLockScreen', 'lockScreenPassword'],
  },
  state: (): AppState => ({
    isLockScreen: false,
    lockScreenPassword: undefined,
  }),
});
