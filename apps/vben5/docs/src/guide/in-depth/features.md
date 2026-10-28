# Tính năng thường dùng

Tổng hợp một số tính năng thường dùng.

## Hết hạn xác thực đăng nhập

Khi interface trả về mã trạng thái `401`, framework sẽ coi xác thực đăng nhập đã hết hạn, khi đăng nhập quá hạn sẽ chuyển đến trang đăng nhập hoặc mở popup đăng nhập. Có thể cấu hình trong `preferences.ts` dưới thư mục ứng dụng:

### Chuyển đến trang đăng nhập

Khi đăng nhập quá hạn sẽ chuyển đến trang đăng nhập

```ts
import { defineOverridesPreferences } from '@vben/preferences';

export const overridesPreferences = defineOverridesPreferences({
  // overrides
  app: {
    loginExpiredMode: 'page',
  },
});
```

### Mở popup đăng nhập

Khi đăng nhập quá hạn sẽ mở popup đăng nhập

![](/guide/login-expired.png)

Cấu hình:

```ts
import { defineOverridesPreferences } from '@vben/preferences';

export const overridesPreferences = defineOverridesPreferences({
  // overrides
  app: {
    loginExpiredMode: 'modal',
  },
});
```

## Tiêu đề động

- Giá trị mặc định:`true`

Sau khi bật, tiêu đề trang web thay đổi theo `title` của route. Trong `preferences.ts` dưới thư mục ứng dụng, bật hoặc tắt là được.

```ts
export const overridesPreferences = defineOverridesPreferences({
  // overrides
  app: {
    dynamicTitle: true,
  },
});
```

## Watermark trang

- Giá trị mặc định:`false`

Sau khi bật, trang web sẽ hiển thị watermark, trong `preferences.ts` dưới thư mục ứng dụng, bật hoặc tắt là được.

```ts
export const overridesPreferences = defineOverridesPreferences({
  // overrides
  app: {
    watermark: true,
  },
});
```

Nếu bạn muốn cập nhật nội dung watermark, có thể làm như sau, tham số có thể tham khảo [watermark-js-plus](https://zhensherlock.github.io/watermark-js-plus/):

```ts
import { useWatermark } from '@vben/hooks';

const { destroyWatermark, updateWatermark } = useWatermark();

await updateWatermark({
  // Nội dung watermark
  content: 'hello my watermark',
});
```
