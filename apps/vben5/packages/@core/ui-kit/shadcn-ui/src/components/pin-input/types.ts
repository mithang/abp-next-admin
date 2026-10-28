interface PinInputProps {
  class?: any;
  /**
   * Độ dài mã xác minh
   */
  codeLength?: number;
  /**
   * Văn bản nút gửi mã xác minh
   */
  createText?: (countdown: number) => string;
  /**
   * Có bị vô hiệu hóa hay không
   */
  disabled?: boolean;
  /**
   * Logic gửi mã xác minh tùy chỉnh
   * @returns
   */
  handleSendCode?: () => Promise<void>;
  /**
   * Trạng thái loading của nút gửi mã xác minh
   */
  loading?: boolean;
  /**
   * Thời gian thử lại tối đa
   */
  maxTime?: number;
}

export type { PinInputProps };
