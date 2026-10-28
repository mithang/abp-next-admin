import type { Component } from 'vue';

interface IContextMenuItem {
  /**
   * @zh_CN Có bị vô hiệu hóa hay không
   */
  disabled?: boolean;
  /**
   * @zh_CN Xử lý sự kiện click
   * @param data
   */
  handler?: (data: any) => void;
  /**
   * @zh_CN Có bị ẩn hay không
   */
  hidden?: boolean;
  /**
   * @zh_CN Biểu tượng
   */
  icon?: Component;
  /**
   * @zh_CN Có hiển thị biểu tượng hay không
   */
  inset?: boolean;
  /**
   * @zh_CN Định danh duy nhất
   */
  key: string;
  /**
   * @zh_CN Có phải là đường phân tách hay không
   */
  separator?: boolean;
  /**
   * @zh_CN Phím tắt
   */
  shortcut?: string;
  /**
   * @zh_CN Tiêu đề
   */
  text: string;
}
export type { IContextMenuItem };
