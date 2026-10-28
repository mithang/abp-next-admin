import { expect, test } from '@playwright/test';

import { authLogin } from './common/auth';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
});

test.describe('Auth Login Page Tests', () => {
  test('check title and page elements', async ({ page }) => {
    // Lấy tiêu đề trang và assert tiêu đề chứa 'Vben Admin'
    const title = await page.title();
    expect(title).toContain('Vben Admin');
  });

  // Trường hợp kiểm thử: Đăng nhập thành công
  test('should successfully login with valid credentials', async ({ page }) => {
    await authLogin(page);
  });
});
