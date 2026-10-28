interface FallbackProps {
  /**
   * Mô tả
   */
  description?: string;
  /**
   *  @zh_CN Địa chỉ route trang chủ
   *  @default /
   */
  homePath?: string;
  /**
   * @zh_CN Hình ảnh hiển thị mặc định
   * @default pageNotFoundSvg
   */
  image?: string;
  /**
   *  @zh_CN Loại có sẵn
   */
  status?: '403' | '404' | '500' | 'coming-soon' | 'offline';
  /**
   *  @zh_CN Câu nhắc của trang
   */
  title?: string;
}
export type { FallbackProps };
