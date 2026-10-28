<script lang="ts" setup>
import { EllipsisText } from '@vben/common-ui';

const text = `
Vben Admin là một giải pháp quản trị dựa trên Vue 3.0, Vite, TypeScript, mục tiêu cung cấp giải pháp sẵn dùng cho việc phát triển các dự án vừa và lớn.
`;
</script>
<template>
  <EllipsisText :line="2" :tooltip-when-ellipsis="true">
    {{ text }}
  </EllipsisText>

  <EllipsisText :line="3" :tooltip-when-ellipsis="true">
    {{ text }}
  </EllipsisText>
</template>
