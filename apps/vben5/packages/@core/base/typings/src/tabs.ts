import type { RouteLocationNormalized } from 'vue-router';

export interface TabDefinition extends RouteLocationNormalized {
  /**
   * Key của tab
   */
  key?: string;
}
