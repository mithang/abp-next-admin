import type { MenuRecordRaw } from '@vben-core/typings';

interface NormalMenuProps {
  /**
   * Dữ liệu menu
   */
  activePath?: string;
  /**
   * Có thu gọn hay không
   */
  collapse?: boolean;
  /**
   * Mục menu
   */
  menus?: MenuRecordRaw[];
  /**
   * @zh_CN Có phải phong cách bo tròn hay không
   * @default true
   */
  rounded?: boolean;
  /**
   * Chủ đề
   */
  theme?: 'dark' | 'light';
}

export type { NormalMenuProps };
