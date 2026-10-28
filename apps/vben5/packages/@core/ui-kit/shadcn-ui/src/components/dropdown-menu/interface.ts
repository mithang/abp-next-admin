import type { Component } from 'vue';

interface VbenDropdownMenuItem {
  disabled?: boolean;
  /**
   * @zh_CN Xử lý sự kiện click
   * @param data
   */
  handler?: (data: any) => void;
  /**
   * @zh_CN Biểu tượng
   */
  icon?: Component;
  /**
   * @zh_CN Tiêu đề
   */
  label: string;
  /**
   * @zh_CN Có phải đường phân cách hay không
   */
  separator?: boolean;
  /**
   * @zh_CN Định danh duy nhất
   */
  value: string;
}

interface DropdownMenuProps {
  menus: VbenDropdownMenuItem[];
}

export type { DropdownMenuProps, VbenDropdownMenuItem };
