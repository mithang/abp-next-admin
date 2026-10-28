<script lang="ts" setup>
import { Page } from '@vben/common-ui';

import { Button, Card, message, notification, Space } from 'antdv-next';

type NotificationType = 'error' | 'info' | 'success' | 'warning';

function info() {
  message.info('How many roads must a man walk down');
}

function error() {
  message.error({
    content: 'Once upon a time you dressed so fine',
    duration: 2.5,
  });
}

function warning() {
  message.warning('How many roads must a man walk down');
}
function success() {
  message.success('Cause you walked hand in hand With another man in my place');
}

function notify(type: NotificationType) {
  notification[type]({
    duration: 2.5,
    title: 'Nói gì đây nhỉ',
    type,
  });
}
</script>

<template>
  <Page
    description="Hỗ trợ đa ngôn ngữ, tích hợp chuyển đổi tính năng chủ đề, v.v."
    title="Demo sử dụng component Ant Design Vue"
  >
    <Card class="mb-5" title="Nút bấm">
      <Space>
        <Button>Default</Button>
        <Button type="primary"> Primary </Button>
        <Button> Info </Button>
        <Button danger> Error </Button>
      </Space>
    </Card>
    <Card class="mb-5" title="Message">
      <Space>
        <Button @click="info"> Thông tin </Button>
        <Button danger @click="error"> Lỗi </Button>
        <Button @click="warning"> Cảnh báo </Button>
        <Button @click="success"> Thành công </Button>
      </Space>
    </Card>

    <Card class="mb-5" title="Notification">
      <Space>
        <Button @click="notify('info')"> Thông tin </Button>
        <Button danger @click="notify('error')"> Lỗi </Button>
        <Button @click="notify('warning')"> Cảnh báo </Button>
        <Button @click="notify('success')"> Thành công </Button>
      </Space>
    </Card>
  </Page>
</template>
