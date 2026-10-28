interface OpenWindowOptions {
  noopener?: boolean;
  noreferrer?: boolean;
  target?: '_blank' | '_parent' | '_self' | '_top' | string;
}

/**
 * Mở URL trong cửa sổ mới.
 *
 * @param url - Địa chỉ web cần mở.
 * @param options - Tùy chọn mở cửa sổ.
 */
function openWindow(url: string, options: OpenWindowOptions = {}): void {
  // Destructuring và đặt giá trị mặc định
  const { noopener = true, noreferrer = true, target = '_blank' } = options;

  // Tạo chuỗi tính năng dựa trên tùy chọn
  const features = [noopener && 'noopener=yes', noreferrer && 'noreferrer=yes']
    .filter(Boolean)
    .join(',');

  // Mở cửa sổ
  window.open(url, target, features);
}

/**
 * Mở route trong cửa sổ mới.
 * @param path
 */
function openRouteInNewWindow(path: string) {
  const { hash, origin } = location;
  const fullPath = path.startsWith('/') ? path : `/${path}`;
  const url = `${origin}${hash && !fullPath.startsWith('/#') ? '/#' : ''}${fullPath}`;
  openWindow(url, { target: '_blank' });
}

export { openRouteInNewWindow, openWindow };
