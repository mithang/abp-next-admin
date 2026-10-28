# Kiểu dáng

::: tip Lời mở đầu

Đối với dự án vue,[tài liệu chính thức](https://vuejs.org/api/sfc-css-features.html#deep-selectors) đã giới thiệu khá chi tiết về cú pháp,ở đây chủ yếu giới thiệu cấu trúc file kiểu và cách sử dụng trong dự án.

:::

## Cấu trúc dự án

Các file kiểu trong dự án được đặt tại `@vben/styles`,bao gồm một số kiểu toàn cục,như kiểu reset, biến toàn cục, v.v.,nó kế thừa kiểu và khả năng của `@vben-core/design`,có thể được ghi đè theo nhu cầu của dự án.

## Scss

Dự án sử dụng `scss` làm bộ tiền xử lý kiểu,có thể dùng các tính năng của `scss` trong dự án,như biến, hàm, mixin, v.v..

```vue
<style lang="scss" scoped>
$font-size: 30px;

.box {
  .title {
    color: green;
    font-size: $font-size;
  }
}
</style>
```

## Postcss

Nếu bạn không quen dùng `scss`,cũng có thể dùng `postcss`,một bộ xử lý kiểu mạnh mẽ hơn,có thể dùng nhiều plugin hơn,dự án đã tích hợp sẵn [postcss-nested](https://github.com/postcss/postcss-nested) plugin,cấu hình `Css Variables`,hoàn toàn có thể thay thế `scss`.

```vue
<style scoped>
.box {
  --font-size: 30px;
  .title {
    color: green;
    font-size: var(--font-size);
  }
}
</style>
```

## Tailwind CSS

Dự án đã tích hợp [Tailwind CSS](https://tailwindcss.com/),có thể dùng tên class của `tailwindcss` trong dự án,để xây dựng trang nhanh chóng.

```vue
<template>
  <div class="bg-white p-4">
    <p class="text-green">hello world</p>
  </div>
</template>
```

## Quy chuẩn BEM

Một lựa chọn khác để tránh xung đột kiểu,là dùng quy chuẩn `BEM`.Nếu chọn `scss` ,nên dùng quy chuẩn đặt tên `BEM`,để quản lý kiểu tốt hơn.Dự án mặc định cung cấp hàm `useNamespace`,có thể tạo namespace một cách thuận tiện.

```vue
<script lang="ts" setup>
import { useNamespace } from '@vben/hooks';

const { b, e, is } = useNamespace('menu');
</script>
<template>
  <div :class="[b()]">
    <div :class="[e('item'), is('active', true)]">item1</div>
  </div>
</template>
<style lang="scss" scoped>
// Nếu dùng trong ứng dụng, dòng code này có thể bỏ qua, vì đã được import toàn cục trong mọi ứng dụng
@use '@vben/styles/global' as *;
@include b('menu') {
  color: black;

  @include e('item') {
    background-color: black;

    @include is('active') {
      background-color: red;
    }
  }
}
</style>
```

## CSS Modules

Đối với vấn đề xung đột kiểu,còn một phương án nữa là dùng giải pháp module hóa `CSS Modules`.Cách sử dụng như sau.

```vue
<template>
  <p :class="$style.red">This should be red</p>
</template>

<style module>
.red {
  color: red;
}
</style>
```

Xem thêm cách dùng tại [tài liệu chính thức về CSS Modules](https://vuejs.org/api/sfc-css-features.html#css-modules).
