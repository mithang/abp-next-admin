// import { ComputedRef } from 'vue';
// import { ThemeEnum } from '/@/enums/appEnum';
// import { MenuModeEnum } from '/@/enums/menuEnum';
export interface MenuState {
  // Danh sách được chọn mặc định
  defaultSelectedKeys: string[];

  // Chế độ
  // mode: MenuModeEnum;

  // // Chủ đề
  // theme: ComputedRef<ThemeEnum> | ThemeEnum;

  // Thụt lề
  inlineIndent?: number;

  // Mảng mở rộng
  openKeys: string[];

  // Mảng key của mục menu đang được chọn
  selectedKeys: string[];

  // Mảng mở rộng ở trạng thái thu gọn
  collapsedOpenKeys: string[];
}
