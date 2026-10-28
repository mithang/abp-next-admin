import type { Page } from '@playwright/test';

import { expect } from '@playwright/test';

export async function authLogin(page: Page) {
  // Đảm bảo biểu mẫu đăng nhập bình thường
  const usernameInput = await page.locator(`input[name='username']`);
  await expect(usernameInput).toBeVisible();

  const passwordInput = await page.locator(`input[name='password']`);
  await expect(passwordInput).toBeVisible();

  const sliderCaptcha = await page.locator(`div[name='captcha']`);
  const sliderCaptchaAction = await page.locator(`div[name='captcha-action']`);
  await expect(sliderCaptcha).toBeVisible();
  await expect(sliderCaptchaAction).toBeVisible();

  // Kéo thanh trượt mã xác minh
  // Lấy vị trí của nút kéo
  const sliderCaptchaBox = await sliderCaptcha.boundingBox();
  if (!sliderCaptchaBox) throw new Error('Không tìm thấy thanh trượt');

  const actionBoundingBox = await sliderCaptchaAction.boundingBox();
  if (!actionBoundingBox) throw new Error('Không tìm thấy nút cần kéo');

  // Tính vị trí bắt đầu và vị trí đích
  const startX = actionBoundingBox.x + actionBoundingBox.width / 2; // Tọa độ x của tâm div
  const startY = actionBoundingBox.y + actionBoundingBox.height / 2; // Tọa độ y của tâm div

  const targetX = startX + sliderCaptchaBox.width + actionBoundingBox.width; // Chiều rộng kéo container sang phải
  const targetY = startY; // Tọa độ y giữ nguyên

  // Mô phỏng kéo chuột
  await page.mouse.move(startX, startY); // Di chuyển đến tâm của action
  await page.mouse.down(); // Nhấn chuột
  await page.mouse.move(targetX, targetY, { steps: 20 }); // Kéo đến vị trí đích
  await page.mouse.up(); // Thả chuột

  // Sau khi kéo, thực hiện assert, kiểm tra action có ở vị trí kỳ vọng,
  const newActionBoundingBox = await sliderCaptchaAction.boundingBox();
  expect(newActionBoundingBox?.x).toBeGreaterThan(actionBoundingBox.x);

  // Đến đây đã xác minh thành công, nhấn để đăng nhập
  await page.waitForTimeout(300);
  await page.getByRole('button', { name: 'login' }).click();
}
