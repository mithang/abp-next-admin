import { TinyColor } from '@ctrl/tinycolor';

/**
 * Chuyển đổi màu sang định dạng HSL.
 *
 * HSL là một mô hình màu, gồm ba thành phần: sắc độ (Hue), độ bão hòa (Saturation) và độ sáng (Lightness).
 *
 * @param {string} color Màu đầu vào.
 * @returns {string} Chuỗi màu định dạng HSL.
 */
function convertToHsl(color: string): string {
  const { a, h, l, s } = new TinyColor(color).toHsl();
  const hsl = `hsl(${Math.round(h)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%)`;
  return a < 1 ? `${hsl} ${a}` : hsl;
}

/**
 * Chuyển đổi màu sang biến CSS HSL.
 *
 * Hàm này tương tự hàm convertToHsl, nhưng định dạng chuỗi trả về hơi khác,
 * để có thể dùng làm biến CSS.
 *
 * @param {string} color Màu đầu vào.
 * @returns {string} Chuỗi màu định dạng HSL có thể dùng làm biến CSS.
 */
function convertToHslCssVar(color: string): string {
  const { a, h, l, s } = new TinyColor(color).toHsl();
  const hsl = `${Math.round(h)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
  return a < 1 ? `${hsl} / ${a}` : hsl;
}

/**
 * Chuyển đổi màu sang chuỗi màu RGB
 * TinyColor không xử lý được chuỗi hsl chứa 'deg', 'grad', 'rad' hoặc 'turn'
 * Ví dụ hsl(231deg 98% 65%) sẽ bị phân tích thành rgb(0, 0, 0)
 * Ở đây các đơn vị này được loại bỏ trước khi chuyển đổi
 * @param str Chuỗi biểu thị giá trị màu HLS
 * @returns Nếu giá trị màu hợp lệ thì trả về chuỗi màu RGB tương ứng; nếu không hợp lệ thì trả về rgb(0, 0, 0)
 */
function convertToRgb(str: string): string {
  return new TinyColor(str.replaceAll(/deg|grad|rad|turn/g, '')).toRgbString();
}

/**
 * Kiểm tra màu có hợp lệ hay không
 * @param {string} color - Màu cần kiểm tra
 * Nếu màu hợp lệ trả về true, ngược lại trả về false
 */
function isValidColor(color?: string) {
  if (!color) {
    return false;
  }
  return new TinyColor(color).isValid;
}

export {
  convertToHsl,
  convertToHslCssVar,
  convertToRgb,
  isValidColor,
  TinyColor,
};
