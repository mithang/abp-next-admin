import { toCanvas } from 'qrcode';
import type { QRCodeRenderersOptions } from 'qrcode';
import { RenderQrCodeParams, ContentType } from './typing';
import { cloneDeep } from 'lodash-es';

export const renderQrCode = ({
  canvas,
  content,
  width = 0,
  options: params = {},
}: RenderQrCodeParams) => {
  const options = cloneDeep(params);
  // Mức chịu lỗi, mặc định mã QR ít nội dung dùng mức chịu lỗi cao, mã QR nhiều nội dung dùng mức chịu lỗi thấp
  options.errorCorrectionLevel = options.errorCorrectionLevel || getErrorCorrectionLevel(content);

  return getOriginWidth(content, options).then((_width: number) => {
    options.scale = width === 0 ? undefined : (width / _width) * 4;
    return toCanvas(canvas, content, options);
  });
};

// Lấy kích thước gốc của QrCode để khi zoom thu được kích thước QrCode chính xác
function getOriginWidth(content: ContentType, options: QRCodeRenderersOptions) {
  const _canvas = document.createElement('canvas');
  return toCanvas(_canvas, content, options).then(() => _canvas.width);
}

// Đối với QrCode ít nội dung, tăng mức chịu lỗi
function getErrorCorrectionLevel(content: ContentType) {
  if (content.length > 36) {
    return 'M';
  } else if (content.length > 16) {
    return 'Q';
  } else {
    return 'H';
  }
}
