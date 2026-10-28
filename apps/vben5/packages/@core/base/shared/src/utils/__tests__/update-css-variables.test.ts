import { expect, it } from 'vitest';

import { updateCSSVariables } from '../update-css-variables';

it('updateCSSVariables should update CSS variables in :root selector', () => {
  // Mô phỏng nội dung stylesheet nội tuyến ban đầu
  const initialStyleContent = ':root { --primaryColor: red; }';
  document.head.innerHTML = `<style id="custom-styles">${initialStyleContent}</style>`;

  // Các biến CSS cần cập nhật và giá trị mới của chúng
  const updatedVariables = {
    fontSize: '16px',
    primaryColor: 'blue',
    secondaryColor: 'green',
  };

  // Gọi hàm để cập nhật biến CSS
  updateCSSVariables(updatedVariables, 'custom-styles');

  // Lấy nội dung style sau khi cập nhật
  const styleElement = document.querySelector('#custom-styles');
  const updatedStyleContent = styleElement ? styleElement.textContent : '';

  // Kiểm tra nội dung style sau cập nhật có chứa đúng giá trị đã cập nhật hay không
  expect(
    updatedStyleContent?.includes('primaryColor: blue;') &&
      updatedStyleContent?.includes('secondaryColor: green;') &&
      updatedStyleContent?.includes('fontSize: 16px;'),
  ).toBe(true);
});
