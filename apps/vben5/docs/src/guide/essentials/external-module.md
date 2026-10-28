# Mô-đun bên ngoài

Ngoài các mô-đun bên ngoài được đưa vào mặc định của dự án, đôi khi chúng ta còn cần đưa vào các mô-đun bên ngoài khác. Lấy [ant-design-vue](https://antdv.com/components/overview) làm ví dụ:

## Cài đặt dependency

::: tip Cài đặt dependency vào package chỉ định

- Vì dự án dùng [pnpm](https://pnpm.io/) làm công cụ quản lý package, nên chúng ta cần dùng lệnh `pnpm` để cài đặt dependency.
- Thông qua việc dùng mô-đun Monorepo để quản lý dự án, nên chúng ta cần cài đặt dependency trong package chỉ định. Trước khi cài đặt dependency, hãy đảm bảo đã vào thư mục của package chỉ định.

:::

```bash
# cd /path/to/your/package
pnpm add ant-design-vue
```

## Sử dụng

### Đưa vào toàn cục

```ts
import { createApp } from 'vue';
import Antd from 'ant-design-vue';
import App from './App';
import 'ant-design-vue/dist/reset.css';

const app = createApp(App);

app.use(Antd).mount('#app');
```

#### Sử dụng

```vue
<template>
  <a-button>text</a-button>
</template>
```

### Đưa vào cục bộ

```vue
<script setup lang="ts">
import { Button } from 'ant-design-vue';
</script>

<template>
  <Button>text</Button>
</template>
```

::: warning Lưu ý

- Nếu component có dependency về kiểu dáng, cần đưa thêm file kiểu dáng vào

:::
