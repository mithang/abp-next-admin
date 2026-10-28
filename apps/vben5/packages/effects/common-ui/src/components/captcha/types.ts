import type { CSSProperties } from 'vue';

import type { ClassType } from '@vben/types';

export interface CaptchaData {
  /**
   * x
   */
  x: number;
  /**
   * y
   */
  y: number;
  /**
   * Dấu thời gian
   */
  t: number;
}
export interface CaptchaPoint extends CaptchaData {
  /**
   * Chỉ số dữ liệu
   */
  i: number;
}
export interface PointSelectionCaptchaCardProps {
  /**
   * Hình ảnh mã xác minh
   */
  captchaImage: string;
  /**
   * Chiều cao hình ảnh mã xác minh
   * @default '220px'
   */
  height?: number | string;
  /**
   * Khoảng đệm ngang
   * @default '12px'
   */
  paddingX?: number | string;
  /**
   * Khoảng đệm dọc
   * @default '16px'
   */
  paddingY?: number | string;
  /**
   * Tiêu đề
   * @default 'Vui lòng nhấn lần lượt theo hình'
   */
  title?: string;
  /**
   * Chiều rộng hình ảnh mã xác minh
   * @default '300px'
   */
  width?: number | string;
}

export interface PointSelectionCaptchaProps extends PointSelectionCaptchaCardProps {
  /**
   * Có hiển thị nút xác nhận hay không
   * @default false
   */
  showConfirm?: boolean;
  /**
   * Hình ảnh gợi ý
   * @default ''
   */
  hintImage?: string;
  /**
   * Văn bản gợi ý
   * @default ''
   */
  hintText?: string;
}

export interface SliderCaptchaProps {
  class?: ClassType;
  /**
   * @description Kiểu của thanh trượt
   * @default {}
   */
  actionStyle?: CSSProperties;

  /**
   * @description Kiểu của thanh trượt
   * @default {}
   */
  barStyle?: CSSProperties;

  /**
   * @description Kiểu của nội dung
   * @default {}
   */
  contentStyle?: CSSProperties;

  /**
   * @description Kiểu của component
   * @default {}
   */
  wrapperStyle?: CSSProperties;

  /**
   * @description Có dùng làm slot hay không, dùng cho component liên động, có thể tham khảo component xác minh xoay
   * @default false
   */
  isSlot?: boolean;

  /**
   * @description Gợi ý khi xác minh thành công
   * @default 'Xác minh thành công'
   */
  successText?: string;

  /**
   * @description Văn bản gợi ý
   * @default 'Vui lòng giữ thanh trượt và kéo'
   */
  text?: string;
}

export interface SliderRotateCaptchaProps {
  /**
   * @description Góc xoay
   * @default 20
   */
  diffDegree?: number;

  /**
   * @description Chiều rộng hình ảnh
   * @default 260
   */
  imageSize?: number;

  /**
   * @description Kiểu hình ảnh
   * @default {}
   */
  imageWrapperStyle?: CSSProperties;

  /**
   * @description Góc xoay tối đa
   * @default 270
   */
  maxDegree?: number;

  /**
   * @description Góc xoay tối thiểu
   * @default 90
   */
  minDegree?: number;

  /**
   * @description Địa chỉ hình ảnh
   */
  src?: string;
  /**
   * @description Văn bản gợi ý mặc định
   */
  defaultTip?: string;
}

export interface SliderTranslateCaptchaProps {
  /**
   * @description Chiều rộng mảnh ghép
   * @default 420
   */
  canvasWidth?: number;
  /**
   * @description Chiều cao mảnh ghép
   * @default 280
   */
  canvasHeight?: number;
  /**
   * @description Độ dài hình vuông trên khối cắt
   * @default 42
   */
  squareLength?: number;
  /**
   * @description Bán kính hình tròn trên khối cắt
   * @default 10
   */
  circleRadius?: number;
  /**
   * @description Địa chỉ hình ảnh
   */
  src?: string;
  /**
   * @description Khoảng chênh lệch tối đa cho phép
   * @default 3
   */
  diffDistance?: number;
  /**
   * @description Văn bản gợi ý mặc định
   */
  defaultTip?: string;
}

export interface CaptchaVerifyPassingData {
  isPassing: boolean;
  time: number | string;
}

export interface SliderCaptchaActionType {
  resume: () => void;
}

export interface SliderRotateVerifyPassingData {
  event: MouseEvent | TouchEvent;
  moveDistance: number;
  moveX: number;
}
