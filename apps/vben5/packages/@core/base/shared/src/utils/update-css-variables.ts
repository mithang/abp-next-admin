/**
 * Hàm cập nhật biến CSS
 * @param variables Ánh xạ giữa các biến CSS cần cập nhật và giá trị mới của chúng
 */
function updateCSSVariables(
  variables: { [key: string]: string },
  id = '__vben-styles__',
): void {
  // Lấy hoặc tạo phần tử stylesheet nội tuyến
  const styleElement =
    document.querySelector(`#${id}`) || document.createElement('style');

  styleElement.id = id;

  // Xây dựng văn bản kiểu cho các biến CSS cần cập nhật
  let cssText = ':root {';
  for (const key in variables) {
    if (Object.prototype.hasOwnProperty.call(variables, key)) {
      cssText += `${key}: ${variables[key]};`;
    }
  }
  cssText += '}';

  // Gán văn bản kiểu cho stylesheet nội tuyến
  styleElement.textContent = cssText;

  // Thêm stylesheet nội tuyến vào phần đầu của tài liệu
  if (!document.querySelector(`#${id}`)) {
    setTimeout(() => {
      document.head.append(styleElement);
    });
  }
}

export { updateCSSVariables };
