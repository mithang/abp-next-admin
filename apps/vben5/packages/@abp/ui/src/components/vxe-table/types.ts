import type {
  VxeGridListeners,
  VxeGridPropTypes,
  VxeGridProps as VxeTableGridProps,
  VxeUIExport,
} from 'vxe-table';

import type { Ref } from 'vue';

import type { ClassType, DeepPartial } from '@vben/types';

import type { BaseFormComponentType, VbenFormProps } from '@vben-core/form-ui';

import type { VxeGridApi } from './api';

import { useVbenForm } from '@vben-core/form-ui';

export interface VxePaginationInfo {
  currentPage: number;
  pageSize: number;
  total: number;
}

interface ToolbarConfigOptions extends VxeGridPropTypes.ToolbarConfig {
  /** Có hiển thị nút chuyển đổi form tìm kiếm hay không */
  search?: boolean;
}

export interface VxeTableGridOptions<T = any> extends VxeTableGridProps<T> {
  /** Cấu hình thanh công cụ */
  toolbarConfig?: ToolbarConfigOptions;
}

export interface SeparatorOptions {
  backgroundColor?: string;
  show?: boolean;
}

export interface VxeGridProps<
  T extends Record<string, any> = any,
  D extends BaseFormComponentType = BaseFormComponentType,
> {
  /**
   * class của component
   */
  class?: ClassType;
  /**
   * Cấu hình form
   */
  formOptions?: VbenFormProps<D>;
  /**
   * vxe-grid class
   */
  gridClass?: ClassType;
  /**
   * Sự kiện vxe-grid
   */
  gridEvents?: DeepPartial<VxeGridListeners<T>>;
  /**
   * Cấu hình vxe-grid
   */
  gridOptions?: DeepPartial<VxeTableGridOptions<T>>;
  /**
   * Thanh phân cách giữa form tìm kiếm và phần thân bảng
   */
  separator?: boolean | SeparatorOptions;
  /**
   * Hiển thị form tìm kiếm
   */
  showSearchForm?: boolean;
  /**
   * Tiêu đề
   */
  tableTitle?: string;
  /**
   * Trợ giúp tiêu đề
   */
  tableTitleHelp?: string;
}

export type ExtendedVxeGridApi<
  D extends Record<string, any> = any,
  F extends BaseFormComponentType = BaseFormComponentType,
> = VxeGridApi<D> & {
  useStore: <T = NoInfer<VxeGridProps<D, F>>>(
    selector?: (state: NoInfer<VxeGridProps<any, any>>) => T,
  ) => Readonly<Ref<T>>;
};

export interface SetupVxeTable {
  configVxeTable: (ui: VxeUIExport) => void;
  useVbenForm: typeof useVbenForm;
}
