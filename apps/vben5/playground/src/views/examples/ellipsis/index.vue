<script lang="ts" setup>
import { ref } from 'vue';

import { EllipsisText, Page } from '@vben/common-ui';

import { Card } from 'ant-design-vue';

import DocButton from '../doc-button.vue';

const longText = `Vben Admin là một giải pháp quản trị dựa trên Vue 3.0, Vite và TypeScript, hướng tới việc cung cấp giải pháp dùng ngay cho việc phát triển các dự án vừa và lớn. Bao gồm các component đóng gói lại, utils, hooks, menu động, kiểm tra quyền, cấu hình đa chủ đề, kiểm soát quyền ở cấp nút bấm và nhiều tính năng khác. Dự án sử dụng các công nghệ frontend mới nhất, có thể dùng làm mẫu khởi động dự án để giúp bạn nhanh chóng xây dựng nguyên mẫu sản phẩm quản trị doanh nghiệp. Đồng thời cũng có thể dùng làm ví dụ để học các công nghệ chính như Vue 3, Vite và TypeScript. Dự án sẽ liên tục theo dõi các công nghệ mới nhất và áp dụng chúng vào dự án.`;

const text = ref(longText);
</script>

<template>
  <Page
    description="Dùng để rút gọn văn bản nhiều dòng, hỗ trợ nhấn để mở rộng và nội dung tùy chỉnh."
    title="Ví dụ component rút gọn văn bản"
  >
    <template #extra>
      <DocButton class="mb-2" path="/components/common-ui/vben-ellipsis-text" />
    </template>
    <Card class="mb-4" title="Cách dùng cơ bản">
      <EllipsisText :max-width="500">{{ text }}</EllipsisText>
    </Card>

    <Card class="mb-4" title="Rút gọn nhiều dòng">
      <EllipsisText :line="2">{{ text }}</EllipsisText>
    </Card>

    <Card class="mb-4" title="Nhấn để mở rộng">
      <EllipsisText :line="3" expand>{{ text }}</EllipsisText>
    </Card>
    <Card class="mb-4" title="Nội dung tùy chỉnh">
      <EllipsisText :max-width="240">
        Sống trong lòng tôi cô độc, con quái biển cô độc, vua của nỗi đau, bắt
        đầu chán chường, ánh sáng đáy biển, những con sóng lặng
        <template #tooltip>
          <div style="text-align: center">
            《Tần Hoàng Đảo》<br />Sống trong lòng tôi cô độc<br />Con quái biển
            cô độc, vua của nỗi đau<br />Bắt đầu chán chường Ánh sáng đáy biển,
            những con sóng lặng
          </div>
        </template>
      </EllipsisText>
    </Card>
  </Page>
</template>
