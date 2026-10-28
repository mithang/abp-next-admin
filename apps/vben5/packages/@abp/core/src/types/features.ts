import type { NameValue } from './global';

type FeatureValue = NameValue<string>;

/**
 * Interface kiểm tra tính năng
 */
interface IFeatureChecker {
  /**
   * Lấy giá trị tính năng
   * @param name Tên tính năng
   * @returns Trả về giá trị tính năng đã thiết lập, không tồn tại thì là chuỗi rỗng
   */
  getOrEmpty(name: string): string;
  /**
   * Tính năng có được bật hay không
   * @param featureNames Tên tính năng
   * @param requiresAll Có yêu cầu tất cả đều thỏa mãn hay không
   */
  isEnabled(featureNames: string | string[], requiresAll?: boolean): boolean;
}

interface IGlobalFeatureChecker {
  isEnabled(featureNames: string | string[], requiresAll?: boolean): boolean;
}

export type { FeatureValue, IFeatureChecker, IGlobalFeatureChecker };
