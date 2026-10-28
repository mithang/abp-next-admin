<script setup lang="ts">
import { Page } from '@vben/common-ui';

import { VbenContextMenu } from '@vben-core/shadcn-ui';

import { Button, Card, message } from 'ant-design-vue';

const needHidden = (role: string) => {
  return role === 'user';
};

const contextMenus = () => {
  return [
    {
      text: 'Làm mới',
      key: 'refresh',
      handler: (data: any) => {
        message.success('Làm mới thành công', data);
      },
      hidden: needHidden('admin'),
    },
    {
      text: 'Đóng tab hiện tại',
      key: 'close-current',
      handler: (data: any) => {
        message.success('Đóng tab hiện tại', data);
      },
      hidden: needHidden('user'),
    },
    {
      text: 'Đóng các tab khác',
      key: 'close-other',
      handler: (data: any) => {
        message.success('Đóng các tab khác', data);
      },
    },
    {
      text: 'Đóng tất cả',
      key: 'close-all',
      handler: (data: any) => {
        message.success('Đóng tất cả', data);
      },
    },
  ];
};
</script>

<template>
  <Page title="Menu ngữ cảnh Context Menu">
    <Card title="Cách dùng cơ bản">
      <div>
        Tổng cộng bốn menu (làm mới, đóng tab hiện tại, đóng các tab khác, đóng
        tất cả)
      </div>
      <br />
      <br />
      <VbenContextMenu :menus="contextMenus" :modal="true" item-class="pr-6">
        <Button>
          Nhấp chuột phải vào tôi để mở menu ngữ cảnh (có mục ẩn)
        </Button>
      </VbenContextMenu>
    </Card>
  </Page>
</template>
