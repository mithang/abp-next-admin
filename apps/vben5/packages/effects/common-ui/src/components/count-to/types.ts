import type { CubicBezierPoints, EasingFunction } from '@vueuse/core';

import type { StyleValue } from 'vue';

import { TransitionPresets as TransitionPresetsData } from '@vueuse/core';

export type TransitionPresets = keyof typeof TransitionPresetsData;

export const TransitionPresetsKeys = Object.keys(
  TransitionPresetsData,
) as TransitionPresets[];

export interface CountToProps {
  /** Giá trị ban đầu */
  startVal?: number;
  /** Giá trị hiện tại */
  endVal: number;
  /** Có vô hiệu hóa animation không */
  disabled?: boolean;
  /** Thời gian trì hoãn bắt đầu animation */
  delay?: number;
  /** Thời lượng  */
  duration?: number;
  /** Số chữ số thập phân  */
  decimals?: number;
  /** Dấu thập phân  */
  decimal?: string;
  /** Ký tự phân tách  */
  separator?: string;
  /** Tiền tố  */
  prefix?: string;
  /** Hậu tố  */
  suffix?: string;
  /** Hiệu ứng chuyển đổi  */
  transition?: CubicBezierPoints | EasingFunction | TransitionPresets;
  /** Tên class của phần nguyên */
  mainClass?: string;
  /** Tên class của phần thập phân */
  decimalClass?: string;
  /** Tên class của phần tiền tố */
  prefixClass?: string;
  /** Tên class của phần hậu tố */
  suffixClass?: string;

  /** Kiểu của phần nguyên */
  mainStyle?: StyleValue;
  /** Kiểu của phần thập phân */
  decimalStyle?: StyleValue;
  /** Kiểu của phần tiền tố */
  prefixStyle?: StyleValue;
  /** Kiểu của phần hậu tố */
  suffixStyle?: StyleValue;
}
