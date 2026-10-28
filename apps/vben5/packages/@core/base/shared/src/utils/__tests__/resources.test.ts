import { beforeEach, describe, expect, it } from 'vitest';

import { loadScript } from '../resources';

const testJsPath =
  'https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.0/jquery.min.js';

describe('loadScript', () => {
  beforeEach(() => {
    // Trước mỗi test, dọn sạch head để đảm bảo môi trường sạch
    document.head.innerHTML = '';
  });

  it('should resolve when the script loads successfully', async () => {
    const promise = loadScript(testJsPath);

    // Lúc này phần tử script đã được tạo và chèn
    const script = document.querySelector(
      `script[src="${testJsPath}"]`,
    ) as HTMLScriptElement;
    expect(script).toBeTruthy();

    // Mô phỏng tải thành công
    script.dispatchEvent(new Event('load'));

    // Chờ promise resolve
    await expect(promise).resolves.toBeUndefined();
  });

  it('should not insert duplicate script and resolve immediately if already loaded', async () => {
    // Trước tiên chèn thủ công một script có cùng src
    const existing = document.createElement('script');
    existing.src = 'bar.js';
    document.head.append(existing);

    // Gọi lại lần nữa
    const promise = loadScript('bar.js');

    // Resolve ngay lập tức
    await expect(promise).resolves.toBeUndefined();

    // Trong head chỉ giữ lại một
    const scripts = document.head.querySelectorAll('script[src="bar.js"]');
    expect(scripts).toHaveLength(1);
  });

  it('should reject when the script fails to load', async () => {
    const promise = loadScript('error.js');

    const script = document.querySelector(
      'script[src="error.js"]',
    ) as HTMLScriptElement;
    expect(script).toBeTruthy();

    // Mô phỏng tải thất bại
    script.dispatchEvent(new Event('error'));

    await expect(promise).rejects.toThrow('Failed to load script: error.js');
  });

  it('should handle multiple concurrent calls and only insert one script tag', async () => {
    const p1 = loadScript(testJsPath);
    const p2 = loadScript(testJsPath);

    const script = document.querySelector(
      `script[src="${testJsPath}"]`,
    ) as HTMLScriptElement;
    expect(script).toBeTruthy();

    // Kích hoạt một lần load, cả hai promise đều phải resolve
    script.dispatchEvent(new Event('load'));

    await expect(p1).resolves.toBeUndefined();
    await expect(p2).resolves.toBeUndefined();

    // Chỉ chèn một lần
    const scripts = document.head.querySelectorAll(
      `script[src="${testJsPath}"]`,
    );
    expect(scripts).toHaveLength(1);
  });
});
