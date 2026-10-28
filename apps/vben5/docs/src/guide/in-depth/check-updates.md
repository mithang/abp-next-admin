# Kiểm tra cập nhật

## Giới thiệu

Khi trang web có cập nhật, bạn có thể cần kiểm tra cập nhật. Framework cung cấp tính năng này, thông qua việc kiểm tra cập nhật định kỳ, bạn có thể cấu hình các trường `checkUpdatesInterval` và `enableCheckUpdates` trong tệp preferences.ts của ứng dụng để bật và đặt khoảng thời gian kiểm tra cập nhật (đơn vị: phút).

```ts
import { defineOverridesPreferences } from '@vben/preferences';

export const overridesPreferences = defineOverridesPreferences({
  // overrides
  app: {
    // Có bật kiểm tra cập nhật không
    enableCheckUpdates: true,
    // Khoảng thời gian kiểm tra cập nhật, đơn vị là phút
    checkUpdatesInterval: 1,
  },
});
```

## Hiệu quả

Khi phát hiện cập nhật, sẽ hiện hộp nhắc hỏi người dùng có làm mới trang không:

![check-updates](/guide/update-notice.png)

## Thay bằng cách kiểm tra cập nhật khác

Nếu cần kiểm tra cập nhật bằng cách khác, ví dụ dùng interface để điều khiển logic cập nhật linh hoạt hơn (như làm mới bắt buộc, hiển thị nội dung cập nhật...), bạn có thể thực hiện bằng cách sửa tệp `src/widgets/check-updates/check-updates.vue` dưới `@vben/layouts`.

```ts
// Tại đây có thể thay bằng logic kiểm tra cập nhật của bạn
async function getVersionTag() {
  try {
    const response = await fetch('/', {
      cache: 'no-cache',
      method: 'HEAD',
    });

    return (
      response.headers.get('etag') || response.headers.get('last-modified')
    );
  } catch {
    console.error('Failed to fetch version tag');
    return null;
  }
}
```

## Thay bằng cách kiểm tra cập nhật dùng thư viện bên thứ ba

Nếu cần kiểm tra cập nhật bằng cách khác, ví dụ dùng cách kiểm soát phiên bản khác (chunkHash, version.json), dùng `Web Worker` để thăm dò cập nhật ở nền, tùy chỉnh thời điểm kiểm tra cập nhật (không dùng thăm dò), bạn có thể thực hiện bằng thư viện JS `version-polling`.

```bash
pnpm add version-polling
```

Lấy dự án `apps/web-antd` làm ví dụ, thêm đoạn mã sau vào tệp điểm vào `main.ts` hoặc `app.vue` của dự án

```ts
import { h } from 'vue';

import { Button, notification } from 'ant-design-vue';
import { createVersionPolling } from 'version-polling';

createVersionPolling({
  silent: import.meta.env.MODE === 'development', // Không kiểm tra trong môi trường phát triển
  onUpdate: (self) => {
    const key = `open${Date.now()}`;
    notification.info({
      message: 'Nhắc nhở',
      description: 'Phát hiện trang web có cập nhật, có làm mới trang để tải phiên bản mới nhất không?',
      btn: () =>
        h(
          Button,
          {
            type: 'primary',
            size: 'small',
            onClick: () => {
              notification.close(key);
              self.onRefresh();
            },
          },
          { default: () => 'Làm mới' },
        ),
      key,
      duration: null,
      placement: 'bottomRight',
    });
  },
});
```
