interface AuthenticationProps {
  /**
   * @zh_CN Đường dẫn đăng nhập bằng mã xác minh
   */
  codeLoginPath?: string;
  /**
   * @zh_CN Đường dẫn quên mật khẩu
   */
  forgetPasswordPath?: string;

  /**
   * @zh_CN Có đang ở trạng thái xử lý tải không
   */
  loading?: boolean;

  /**
   * @zh_CN Đường dẫn đăng nhập bằng mã QR
   */
  qrCodeLoginPath?: string;

  /**
   * @zh_CN Đường dẫn đăng ký
   */
  registerPath?: string;

  /**
   * @zh_CN Có hiển thị đăng nhập bằng mã xác minh không
   */
  showCodeLogin?: boolean;
  /**
   * @zh_CN Có hiển thị quên mật khẩu không
   */
  showForgetPassword?: boolean;

  /**
   * @zh_CN Có hiển thị đăng nhập bằng mã QR không
   */
  showQrcodeLogin?: boolean;

  /**
   * @zh_CN Có hiển thị nút đăng ký không
   */
  showRegister?: boolean;

  /**
   * @zh_CN Có hiển thị ghi nhớ tài khoản không
   */
  showRememberMe?: boolean;

  /**
   * @zh_CN Có hiển thị đăng nhập bên thứ ba không
   */
  showThirdPartyLogin?: boolean;

  /**
   * @zh_CN Tiêu đề phụ của hộp đăng nhập
   */
  subTitle?: string;

  /**
   * @zh_CN Tiêu đề của hộp đăng nhập
   */
  title?: string;
  /**
   * @zh_CN Văn bản nút gửi
   */
  submitButtonText?: string;
}

export type { AuthenticationProps };
