import type { ComputedRef, VNode } from 'vue';
import type {
  RouteLocationNormalized,
  RouteLocationNormalizedLoaded,
  RouteLocationNormalizedLoadedGeneric,
  Router,
  RouteRecordNormalized,
} from 'vue-router';

import type { TabDefinition } from '@vben-core/typings';

import { markRaw, toRaw } from 'vue';

import { preferences } from '@vben-core/preferences';
import {
  createStack,
  openRouteInNewWindow,
  Stack,
  startProgress,
  stopProgress,
} from '@vben-core/shared/utils';

import { acceptHMRUpdate, defineStore } from 'pinia';

interface RouteCached {
  component: VNode;
  key: string;
  route: RouteLocationNormalizedLoadedGeneric;
}

interface TabbarState {
  cachedRoutes: Map<string, RouteCached>;
  /**
   * @zh_CN Bộ nhớ đệm danh sách các tab đang mở
   */
  cachedTabs: Set<string>;
  /**
   * @zh_CN Chỉ số kết thúc kéo thả
   */
  dragEndIndex: number;
  /**
   * @zh_CN Các tab cần loại khỏi bộ nhớ đệm
   */
  excludeCachedTabs: Set<string>;
  /**
   * @zh_CN Danh sách menu chuột phải của tab
   */
  menuList: string[];
  /**
   * @zh_CN Có làm mới hay không
   */
  renderRouteView?: boolean;
  /**
   * @zh_CN Danh sách các tab đang mở
   */
  tabs: TabDefinition[];
  /**
   * @zh_CN Thời gian cập nhật, dùng cho một số tình huống cập nhật; nếu dùng watch theo dõi sâu sẽ tốn hiệu năng
   */
  updateTime?: number;
  /**
   * @zh_CN Tab được mở bởi tab trước đó
   */
  visitHistory: Stack<string>;
}

/**
 * @zh_CN Số lượng tối đa của lịch sử truy cập
 */
const MAX_VISIT_HISTORY = 50;

/**
 * @zh_CN Liên quan đến quyền truy cập
 */
export const useTabbarStore = defineStore('core-tabbar', {
  actions: {
    /**
     * Close tabs in bulk
     */
    async _bulkCloseByKeys(keys: string[]) {
      const keySet = new Set(keys);
      this.tabs = this.tabs.filter(
        (item) => !keySet.has(getTabKeyFromTab(item)),
      );
      if (isVisitHistory()) {
        this.visitHistory.remove(...keys);
      }

      await this.updateCacheTabs();
    },
    /**
     * @zh_CN Đóng tab
     * @param tab
     */
    _close(tab: TabDefinition) {
      if (isAffixTab(tab)) {
        return;
      }
      const index = this.tabs.findIndex((item) => equalTab(item, tab));
      index !== -1 && this.tabs.splice(index, 1);
    },
    /**
     * @zh_CN Chuyển đến tab mặc định
     */
    async _goToDefaultTab(router: Router) {
      if (this.getTabs.length <= 0) {
        return;
      }
      const firstTab = this.getTabs[0];
      if (firstTab) {
        await this._goToTab(firstTab, router);
      }
    },
    /**
     * @zh_CN Chuyển đến tab
     * @param tab
     * @param router
     */
    async _goToTab(tab: TabDefinition, router: Router) {
      const { params, path, query } = tab;
      const toParams = {
        params: params || {},
        path,
        query: query || {},
      };
      await router.replace(toParams);
    },
    /**
     * @zh_CN Thêm tab
     * @param routeTab
     */
    addTab(routeTab: TabDefinition): TabDefinition {
      let tab = cloneTab(routeTab);
      if (!tab.key) {
        tab.key = getTabKey(routeTab);
      }
      if (!isTabShown(tab)) {
        return tab;
      }

      const tabIndex = this.tabs.findIndex((item) => {
        return equalTab(item, tab);
      });

      if (tabIndex === -1) {
        const maxCount = preferences.tabbar.maxCount;
        // Lấy số lượng route động đang mở, lớn hơn 0 tức là cần kiểm soát số lượng mở
        const maxNumOfOpenTab = (routeTab?.meta?.maxNumOfOpenTab ??
          -1) as number;
        // Nếu cấp của route động lớn hơn 0 thì phải giới hạn số lượng mở của route đó
        // Lấy số lượng route động đã mở, kiểm tra xem có lớn hơn một giá trị nào đó không
        if (
          maxNumOfOpenTab > 0 &&
          this.tabs.filter((tab) => tab.name === routeTab.name).length >=
            maxNumOfOpenTab
        ) {
          // Đóng tab đầu tiên
          const index = this.tabs.findIndex(
            (item) => item.name === routeTab.name,
          );
          index !== -1 && this.tabs.splice(index, 1);
        } else if (maxCount > 0 && this.tabs.length >= maxCount) {
          // Đóng tab đầu tiên
          const index = this.tabs.findIndex(
            (item) =>
              !Reflect.has(item.meta, 'affixTab') || !item.meta.affixTab,
          );
          index !== -1 && this.tabs.splice(index, 1);
        }
        this.tabs.push(tab);
      } else {
        // Trang đã tồn tại, không thêm tab trùng lặp, chỉ cập nhật tham số của tab
        const currentTab = toRaw(this.tabs)[tabIndex];
        const mergedTab = {
          ...currentTab,
          ...tab,
          meta: { ...currentTab?.meta, ...tab.meta },
        };
        if (currentTab) {
          const curMeta = currentTab.meta;
          if (Reflect.has(curMeta, 'affixTab')) {
            mergedTab.meta.affixTab = curMeta.affixTab;
          }
          if (Reflect.has(curMeta, 'newTabTitle')) {
            mergedTab.meta.newTabTitle = curMeta.newTabTitle;
          }
        }
        tab = mergedTab;
        this.tabs.splice(tabIndex, 1, mergedTab);
      }
      this.updateCacheTabs();
      // Thêm lịch sử truy cập
      if (isVisitHistory()) {
        this.visitHistory.push(tab.key as string);
      }
      return tab;
    },
    /**
     * @zh_CN Đóng tất cả các tab
     */
    async closeAllTabs(router: Router) {
      const newTabs = this.tabs.filter((tab) => isAffixTab(tab));
      this.tabs = newTabs.length > 0 ? newTabs : [...this.tabs].splice(0, 1);
      // Thiết lập lịch sử truy cập
      if (isVisitHistory()) {
        this.visitHistory.retain(
          this.tabs.map((item) => getTabKeyFromTab(item)),
        );
      }
      await this._goToDefaultTab(router);
      this.updateCacheTabs();
    },
    /**
     * @zh_CN Đóng các tab bên trái
     * @param tab
     */
    async closeLeftTabs(tab: TabDefinition) {
      const index = this.tabs.findIndex((item) => equalTab(item, tab));

      if (index < 1) {
        return;
      }

      const leftTabs = this.tabs.slice(0, index);
      const keys: string[] = [];

      for (const item of leftTabs) {
        if (!isAffixTab(item)) {
          keys.push(item.key as string);
        }
      }
      await this._bulkCloseByKeys(keys);
    },
    /**
     * @zh_CN Đóng các tab khác
     * @param tab
     */
    async closeOtherTabs(tab: TabDefinition) {
      const closeKeys = this.tabs.map((item) => getTabKeyFromTab(item));

      const keys: string[] = [];

      for (const key of closeKeys) {
        if (key !== getTabKeyFromTab(tab)) {
          const closeTab = this.tabs.find(
            (item) => getTabKeyFromTab(item) === key,
          );
          if (!closeTab) {
            continue;
          }
          if (!isAffixTab(closeTab)) {
            keys.push(closeTab.key as string);
          }
        }
      }
      await this._bulkCloseByKeys(keys);
    },
    /**
     * @zh_CN Đóng các tab bên phải
     * @param tab
     */
    async closeRightTabs(tab: TabDefinition) {
      const index = this.tabs.findIndex((item) => equalTab(item, tab));

      if (index !== -1 && index < this.tabs.length - 1) {
        const rightTabs = this.tabs.slice(index + 1);

        const keys: string[] = [];
        for (const item of rightTabs) {
          if (!isAffixTab(item)) {
            keys.push(item.key as string);
          }
        }
        await this._bulkCloseByKeys(keys);
      }
    },

    /**
     * @zh_CN Đóng tab
     * @param tab
     * @param router
     */
    async closeTab(tab: TabDefinition, router: Router) {
      const { currentRoute } = router;
      const currentTabKey = getTabKey(currentRoute.value);
      // Đóng tab không phải là tab đang kích hoạt
      if (currentTabKey !== getTabKeyFromTab(tab)) {
        this._close(tab);
        this.updateCacheTabs();
        // Xóa khỏi lịch sử truy cập
        if (isVisitHistory()) {
          this.visitHistory.remove(getTabKeyFromTab(tab));
        }
        return;
      }
      if (this.getTabs.length <= 1) {
        console.error('Failed to close the tab; only one tab remains open.');
        return;
      }
      // Xóa tab đang đóng khỏi lịch sử truy cập
      if (isVisitHistory()) {
        this.visitHistory.remove(currentTabKey);
        this._close(tab);

        let previousTab: TabDefinition | undefined;
        let previousTabKey: string | undefined;
        while (true) {
          previousTabKey = this.visitHistory.pop();
          if (!previousTabKey) {
            break;
          }
          previousTab = this.getTabByKey(previousTabKey);
          if (previousTab) {
            break;
          }
        }
        await (previousTab
          ? this._goToTab(previousTab, router)
          : this._goToDefaultTab(router));
        return;
      }
      // Chưa bật lịch sử truy cập, chuyển thẳng đến tab tiếp theo hoặc tab trước đó
      const index = this.getTabs.findIndex(
        (item) => getTabKeyFromTab(item) === getTabKey(currentRoute.value),
      );

      const before = this.getTabs[index - 1];
      const after = this.getTabs[index + 1];

      // Tab tiếp theo tồn tại, chuyển đến tab tiếp theo
      if (after) {
        this._close(tab);
        await this._goToTab(after, router);
        // Tab trước đó tồn tại, chuyển đến tab trước đó
      } else if (before) {
        this._close(tab);
        await this._goToTab(before, router);
      }
    },

    /**
     * @zh_CN Đóng tab theo key
     * @param key
     * @param router
     */
    async closeTabByKey(key: string, router: Router) {
      const originKey = decodeURIComponent(key);
      const index = this.tabs.findIndex(
        (item) => getTabKeyFromTab(item) === originKey,
      );
      if (index === -1) {
        return;
      }

      const tab = this.tabs[index];
      if (tab) {
        await this.closeTab(tab, router);
      }
    },

    /**
     * Lấy tab theo key của tab
     * @param key
     */
    getTabByKey(key: string) {
      return this.getTabs.find(
        (item) => getTabKeyFromTab(item) === key,
      ) as TabDefinition;
    },
    /**
     * @zh_CN Mở tab trong cửa sổ mới
     * @param tab
     */
    async openTabInNewWindow(tab: TabDefinition) {
      openRouteInNewWindow(tab.fullPath || tab.path);
    },

    /**
     * @zh_CN Ghim tab
     * @param tab
     */
    async pinTab(tab: TabDefinition) {
      const index = this.tabs.findIndex((item) => equalTab(item, tab));
      if (index === -1) {
        return;
      }
      const oldTab = this.tabs[index];
      tab.meta.affixTab = true;
      tab.meta.title = oldTab?.meta?.title as string;
      // this.addTab(tab);
      this.tabs.splice(index, 1, tab);
      // Lọc các tab đã ghim, nếu sau này thay đổi giá trị affixTabOrder có thể sẽ có vấn đề, hiện tại việc sắp xếp affixTabs ở dòng 464 chưa đặt giá trị
      const affixTabs = this.tabs.filter((tab) => isAffixTab(tab));
      // Lấy index của các tab đã ghim
      const newIndex = affixTabs.findIndex((item) => equalTab(item, tab));
      // Hoán đổi vị trí để sắp xếp lại
      await this.sortTabs(index, newIndex);
    },

    /**
     * Làm mới tab
     */
    async refresh(router: Router | string) {
      // Nếu là route của Router thì làm mới theo route hiện tại
      // Nếu là chuỗi string, tức tên route, thì làm mới tab được chỉ định theo tên, không được là tên route hiện tại, nếu không sẽ không làm mới
      if (typeof router === 'string') {
        return await this.refreshByName(router);
      }

      const { currentRoute } = router;
      const { name } = currentRoute.value;

      this.excludeCachedTabs.add(name as string);
      this.renderRouteView = false;
      startProgress();

      await new Promise((resolve) => setTimeout(resolve, 200));

      this.excludeCachedTabs.delete(name as string);
      this.renderRouteView = true;
      stopProgress();
    },

    /**
     * Làm mới tab được chỉ định theo tên route
     */
    async refreshByName(name: string) {
      this.excludeCachedTabs.add(name);
      await new Promise((resolve) => setTimeout(resolve, 200));
      this.excludeCachedTabs.delete(name);
    },

    /**
     * @zh_CN Đặt lại tiêu đề tab
     */
    async resetTabTitle(tab: TabDefinition) {
      if (tab?.meta?.newTabTitle) {
        return;
      }
      const findTab = this.tabs.find((item) => equalTab(item, tab));
      if (findTab) {
        findTab.meta.newTabTitle = undefined;
        await this.updateCacheTabs();
      }
    },

    /**
     * Đặt các tab đã ghim
     * @param tabs
     */
    setAffixTabs(tabs: RouteRecordNormalized[]) {
      for (const tab of tabs) {
        tab.meta.affixTab = true;
        this.addTab(routeToTab(tab));
      }
    },

    /**
     * @zh_CN Cập nhật danh sách menu
     * @param list
     */
    setMenuList(list: string[]) {
      this.menuList = list;
    },

    /**
     * @zh_CN Đặt tiêu đề tab
     *
     * @zh_CN Hỗ trợ đặt chuỗi tiêu đề tĩnh hoặc thuộc tính tính toán (computed) làm tiêu đề động
     * @zh_CN Khi tiêu đề là thuộc tính tính toán, tiêu đề sẽ tự động cập nhật theo sự thay đổi của giá trị thuộc tính tính toán
     * @zh_CN Phù hợp với các tình huống cần cập nhật tiêu đề động theo trạng thái hoặc đa ngôn ngữ
     *
     * @param {TabDefinition} tab - Đối tượng tab
     * @param {ComputedRef<string> | string} title - Nội dung tiêu đề, hỗ trợ chuỗi tĩnh hoặc thuộc tính tính toán
     *
     * @example
     * // Đặt tiêu đề tĩnh
     * setTabTitle(tab, 'Tab mới');
     *
     * @example
     * // Đặt tiêu đề động
     * setTabTitle(tab, computed(() => t('common.dashboard')));
     */
    async setTabTitle(tab: TabDefinition, title: ComputedRef<string> | string) {
      const findTab = this.tabs.find((item) => equalTab(item, tab));

      if (findTab) {
        findTab.meta.newTabTitle = title;

        await this.updateCacheTabs();
      }
    },
    setUpdateTime() {
      this.updateTime = Date.now();
    },
    /**
     * @zh_CN Đặt thứ tự các tab
     * @param oldIndex
     * @param newIndex
     */
    async sortTabs(oldIndex: number, newIndex: number) {
      const currentTab = this.tabs[oldIndex];
      if (!currentTab) {
        return;
      }
      this.tabs.splice(oldIndex, 1);
      this.tabs.splice(newIndex, 0, currentTab);
      this.dragEndIndex = this.dragEndIndex + 1;
    },

    /**
     * @zh_CN Chuyển đổi trạng thái ghim tab
     * @param tab
     */
    async toggleTabPin(tab: TabDefinition) {
      const affixTab = tab?.meta?.affixTab ?? false;

      await (affixTab ? this.unpinTab(tab) : this.pinTab(tab));
    },

    /**
     * @zh_CN Hủy ghim tab
     * @param tab
     */
    async unpinTab(tab: TabDefinition) {
      const index = this.tabs.findIndex((item) => equalTab(item, tab));
      if (index === -1) {
        return;
      }
      const oldTab = this.tabs[index];
      tab.meta.affixTab = false;
      tab.meta.title = oldTab?.meta?.title as string;
      // this.addTab(tab);
      this.tabs.splice(index, 1, tab);
      // Lọc các tab đã ghim, nếu sau này thay đổi giá trị affixTabOrder có thể sẽ có vấn đề, hiện tại việc sắp xếp affixTabs ở dòng 464 chưa đặt giá trị
      const affixTabs = this.tabs.filter((tab) => isAffixTab(tab));
      // Lấy index của các tab đã ghim, dùng vị trí tiếp theo của các tab đã ghim, tức vị trí đầu tiên của các tab đang hoạt động
      const newIndex = affixTabs.length;
      // Hoán đổi vị trí để sắp xếp lại
      await this.sortTabs(index, newIndex);
    },
    /**
     * Cập nhật bộ nhớ đệm theo các tab đang mở
     */
    async updateCacheTabs() {
      const cacheMap = new Set<string>();

      for (const tab of this.tabs) {
        // Bỏ qua các tab không cần duy trì (persist)
        const keepAlive = tab.meta?.keepAlive;
        if (!keepAlive) {
          continue;
        }
        (tab.matched || []).forEach((t, i) => {
          if (i > 0) {
            cacheMap.add(t.name as string);
          }
        });

        const name = tab.name as string;
        cacheMap.add(name);
      }
      this.cachedTabs = cacheMap;
    },
    /**
     * Thêm route đã lưu vào bộ nhớ đệm
     * @param component
     * @param route
     */
    addCachedRoute(component: VNode, route: RouteLocationNormalizedLoaded) {
      const key = getTabKey(route);
      if (this.cachedRoutes.has(key)) {
        return;
      }
      this.cachedRoutes.set(key, {
        key,
        component: markRaw(component),
        route: markRaw(route),
      });
    },
    removeCachedRoute(key: string) {
      this.cachedRoutes.delete(key);
    },
  },
  getters: {
    affixTabs(): TabDefinition[] {
      const affixTabs = this.tabs.filter((tab) => isAffixTab(tab));

      return affixTabs.toSorted((a, b) => {
        const orderA = (a.meta?.affixTabOrder ?? 0) as number;
        const orderB = (b.meta?.affixTabOrder ?? 0) as number;
        return orderA - orderB;
      });
    },
    getCachedTabs(): string[] {
      return [...this.cachedTabs];
    },
    getExcludeCachedTabs(): string[] {
      return [...this.excludeCachedTabs];
    },
    getMenuList(): string[] {
      return this.menuList;
    },
    getTabs(): TabDefinition[] {
      const normalTabs = this.tabs.filter((tab) => !isAffixTab(tab));
      return [...this.affixTabs, ...normalTabs].filter(Boolean);
    },
    getCachedRoutes(): Map<string, RouteCached> {
      return this.cachedRoutes;
    },
  },
  persist: [
    // tabs không cần lưu trong localStorage
    {
      pick: ['tabs', 'visitHistory'],
      storage: sessionStorage,
      serializer: {
        serialize: JSON.stringify,
        deserialize(value: string) {
          const parsed = JSON.parse(value);
          // Sau khi đối tượng Stack được tuần tự hóa JSON sẽ trở thành đối tượng thường {dedup, items, maxSize},
          // mất tất cả phương thức và getter, cần xây dựng lại đối tượng Stack
          if (parsed.visitHistory && !(parsed.visitHistory instanceof Stack)) {
            const raw = parsed.visitHistory;
            const stack = createStack<string>(true, MAX_VISIT_HISTORY);
            if (Array.isArray(raw.items)) {
              stack.push(...raw.items);
            }
            parsed.visitHistory = stack;
          }
          return parsed;
        },
      },
    },
  ],
  state: (): TabbarState => ({
    visitHistory: createStack<string>(true, MAX_VISIT_HISTORY),
    cachedRoutes: new Map<string, RouteCached>(),
    cachedTabs: new Set(),
    dragEndIndex: 0,
    excludeCachedTabs: new Set(),
    menuList: [
      'close',
      'affix',
      'maximize',
      'reload',
      'open-in-new-window',
      'close-left',
      'close-right',
      'close-other',
      'close-all',
    ],
    renderRouteView: true,
    tabs: [],
    updateTime: Date.now(),
  }),
});

// Giải quyết vấn đề hot update
const hot = import.meta.hot;
if (hot) {
  hot.accept(acceptHMRUpdate(useTabbarStore, hot));
}

/**
 * @zh_CN Sao chép route, ngăn route bị sửa đổi
 * @param route
 */
function cloneTab(route: TabDefinition): TabDefinition {
  if (!route) {
    return route;
  }
  const { matched, meta, ...opt } = route;
  return {
    ...opt,
    matched: (matched
      ? matched.map((item) => ({
          meta: item.meta,
          name: item.name,
          path: item.path,
        }))
      : undefined) as RouteRecordNormalized[],
    meta: {
      ...meta,
      newTabTitle: meta.newTabTitle,
    },
  };
}

/**
 * @zh_CN Có phải là tab đã ghim hay không
 * @param tab
 */
function isAffixTab(tab: TabDefinition) {
  return tab?.meta?.affixTab ?? false;
}

/**
 * @zh_CN Có hiển thị tab hay không
 * @param tab
 */
function isTabShown(tab: TabDefinition) {
  const matched = tab?.matched ?? [];
  return !tab.meta.hideInTab && matched.every((item) => !item.meta.hideInTab);
}

/**
 * Lấy key của tab từ route
 * @param tab
 */
function getTabKey(tab: RouteLocationNormalized | RouteRecordNormalized) {
  const {
    fullPath,
    path,
    meta: { fullPathKey } = {},
    query = {},
  } = tab as RouteLocationNormalized;
  // pageKey có thể là mảng (khi tham số truy vấn bị trùng lặp)
  const pageKey = Array.isArray(query.pageKey)
    ? query.pageKey[0]
    : query.pageKey;
  let rawKey;
  if (pageKey) {
    rawKey = pageKey;
  } else {
    rawKey = fullPathKey === false ? path : (fullPath ?? path);
  }
  try {
    return decodeURIComponent(rawKey);
  } catch {
    return rawKey;
  }
}

/**
 * @zh_CN Có bật lịch sử truy cập hay không
 */
function isVisitHistory() {
  return preferences.tabbar.visitHistory;
}

/**
 * Lấy key của tab từ tab
 * Nếu tab không có key thì lấy key từ route
 * @param tab
 */
function getTabKeyFromTab(tab: TabDefinition): string {
  return tab.key ?? getTabKey(tab);
}

/**
 * So sánh hai tab có bằng nhau hay không
 * @param a
 * @param b
 */
function equalTab(a: TabDefinition, b: TabDefinition) {
  return getTabKeyFromTab(a) === getTabKeyFromTab(b);
}

function routeToTab(route: RouteRecordNormalized) {
  return {
    meta: route.meta,
    name: route.name,
    path: route.path,
    key: getTabKey(route),
  } as TabDefinition;
}

export { getTabKey };
