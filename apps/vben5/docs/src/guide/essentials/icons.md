# Biểu tượng

::: tip Về quản lý biểu tượng

- Biểu tượng của dự án chủ yếu do package `@vben/icons` cung cấp, nên quản lý thống nhất bên trong package này để dễ quản lý và bảo trì.
- Nếu bạn dùng `Vscode`, nên cài đặt plugin [Iconify IntelliSense](https://marketplace.visualstudio.com/items?itemName=antfu.iconify) để dễ dàng tìm kiếm và sử dụng biểu tượng.

:::

Dự án có nhiều cách sử dụng biểu tượng sau đây, có thể chọn theo thực tế:

## Biểu tượng Iconify <Badge text="Khuyến nghị" type="tip"/>

Đã tích hợp thư viện biểu tượng [iconify](https://github.com/iconify/iconify)

### Thêm mới

Có thể thêm biểu tượng mới trong thư mục `packages/icons/src/iconify`:

```ts
// packages/icons/src/iconify/index.ts
import { createIconifyIcon } from '@vben-core/icons';

export const MdiKeyboardEsc = createIconifyIcon('mdi:keyboard-esc');
```

### Sử dụng

```vue
<script setup lang="ts">
import { MdiKeyboardEsc } from '@vben/icons';
</script>

<template>
  <!-- Một biểu tượng có chiều rộng và chiều cao 20px -->
  <MdiKeyboardEsc class="size-5" />
</template>
```

## Biểu tượng Svg <Badge text="Khuyến nghị" type="tip"/>

Không dùng cách Svg Sprite mà trực tiếp import biểu tượng Svg,

### Thêm mới

Có thể thêm tệp biểu tượng `test.svg` trong thư mục `packages/icons/src/svg/icons`, sau đó import trong `packages/icons/src/svg/index.ts`:

```ts
// packages/icons/src/svg/index.ts
import { createIconifyIcon } from '@vben-core/icons';

const SvgTestIcon = createIconifyIcon('svg:test');

export { SvgTestIcon };
```

### Sử dụng

```vue
<script setup lang="ts">
import { SvgTestIcon } from '@vben/icons';
</script>

<template>
  <!-- Một biểu tượng có chiều rộng và chiều cao 20px -->
  <SvgTestIcon class="size-5" />
</template>
```

## Biểu tượng Tailwind CSS

### Sử dụng

Chỉ cần thêm trực tiếp tên class biểu tượng Tailwind CSS là dùng được, tên class biểu tượng có thể xem tại [iconify](https://github.com/iconify/iconify):

```vue
<span class="icon-[mdi--ab-testing]"></span>
```
