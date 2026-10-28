import type { VxeGridSlots, VxeGridSlotTypes } from 'vxe-table';

import type { SlotsType } from 'vue';

import type { BaseFormComponentType } from '@vben-core/form-ui';

import type { ExtendedVxeGridApi, VxeGridProps } from './types';

import { defineComponent, h, onBeforeUnmount } from 'vue';

import { useStore } from '@vben-core/shared/store';

import { VxeGridApi } from './api';
import VxeGrid from './use-vxe-grid.vue';

type FilteredSlots<T> = {
  [
    K in keyof VxeGridSlots<T> as K extends 'form' ? never : K
  ]: VxeGridSlots<T>[K];
};

export function useVbenVxeGrid<
  T extends Record<string, any> = any,
  D extends BaseFormComponentType = BaseFormComponentType,
>(options: VxeGridProps<T, D>) {
  // const IS_REACTIVE = isReactive(options);
  const api = new VxeGridApi(options);
  const extendedApi: ExtendedVxeGridApi<T, D> = api as ExtendedVxeGridApi<T, D>;
  extendedApi.useStore = (selector) => {
    return useStore(api.store, selector);
  };

  const Grid = defineComponent(
    (props: VxeGridProps<T>, { attrs, slots }) => {
      // Tách `class` khỏi attrs: kiểu ClassValue của Vue (chấp nhận false/null)
      // rộng hơn ClassType của VxeGridProps. Khi parent không truyền class thì
      // giữ nguyên props.class; ngược lại chuẩn hóa false/null về undefined —
      // tương đương khi render (Vue đều coi là không có class).
      const { class: attrsClass, ...restAttrs } = attrs;
      const mergedClass =
        attrsClass === undefined ? props.class : attrsClass || undefined;
      onBeforeUnmount(() => {
        api.unmount();
      });
      api.setState({ ...props, ...restAttrs, class: mergedClass });
      return () =>
        h(
          VxeGrid,
          { ...props, ...restAttrs, class: mergedClass, api: extendedApi },
          slots,
        );
    },
    {
      name: 'VbenVxeGrid',
      inheritAttrs: false,
      slots: Object as SlotsType<
        {
          // Tiêu đề bảng
          'table-title': undefined;
          // Phần bên trái thanh công cụ
          'toolbar-actions': VxeGridSlotTypes.DefaultSlotParams<T>;
          // Phần bên phải thanh công cụ
          'toolbar-tools': VxeGridSlotTypes.DefaultSlotParams<T>;
        } & FilteredSlots<T>
      >,
    },
  );
  // Add reactivity support
  // if (IS_REACTIVE) {
  //   watch(
  //     () => options,
  //     () => {
  //       api.setState(options);
  //     },
  //     { immediate: true },
  //   );
  // }

  return [Grid, extendedApi] as const;
}

export type UseVbenVxeGrid = typeof useVbenVxeGrid;
