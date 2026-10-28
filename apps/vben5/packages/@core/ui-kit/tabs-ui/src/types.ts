import type { IContextMenuItem } from '@vben-core/shadcn-ui';
import type { TabDefinition, TabsStyleType } from '@vben-core/typings';

export type TabsEmits = {
  close: [string];
  sortTabs: [number, number];
  unpin: [TabDefinition];
};

export interface TabsProps {
  active?: string;
  /**
   * @zh_CN content class
   * @default tabs-chrome
   */
  contentClass?: string;
  /**
   * @zh_CN Menu chuột phải
   */
  contextMenus?: (data: any) => IContextMenuItem[];
  /**
   * @zh_CN Có thể kéo thả hay không
   */
  draggable?: boolean;
  /**
   * @zh_CN Khoảng cách
   * @default 7
   * Chỉ dành cho tabs-chrome
   */
  gap?: number;
  /**
   * @zh_CN Chiều rộng tối đa của tab
   * Chỉ dành cho tabs-chrome
   */
  maxWidth?: number;
  /**
   * @zh_CN Đóng Tab khi nhấn nút giữa chuột
   */
  middleClickToClose?: boolean;

  /**
   * @zh_CN Chiều rộng tối thiểu của tab
   * Chỉ dành cho tabs-chrome
   */
  minWidth?: number;

  /**
   * @zh_CN Có hiển thị biểu tượng hay không
   */
  showIcon?: boolean;
  /**
   * @zh_CN Kiểu tab
   */
  styleType?: TabsStyleType;

  /**
   * @zh_CN Dữ liệu tab
   */
  tabs?: TabDefinition[];

  /**
   * @zh_CN Có phản hồi sự kiện con lăn chuột hay không
   */
  wheelable?: boolean;
}

export interface TabConfig extends TabDefinition {
  affixTab: boolean;
  closable: boolean;
  icon: string;
  key: string;
  title: string;
}
