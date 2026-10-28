<script lang="ts" setup>
import type { NotificationType } from 'naive-ui';

import { Page } from '@vben/common-ui';

import { NButton, NCard, NSpace, useMessage, useNotification } from 'naive-ui';

const notification = useNotification();

const message = useMessage();
function error() {
  message.error('Once upon a time you dressed so fine');
}

function warning() {
  message.warning('How many roads must a man walk down');
}
function success() {
  message.success('Cause you walked hand in hand With another man in my place');
}
function loading() {
  message.loading(
    'If I were you, I will realize that I love you more than any other guy',
  );
}

function notify(type: NotificationType) {
  notification[type]({
    content: 'Nói gì đây nhỉ',
    duration: 2500,
    keepAliveOnHover: true,
    meta: 'Không nghĩ ra được',
  });
}
</script>

<template>
  <Page
    description="Hỗ trợ đa ngôn ngữ, tích hợp chuyển đổi tính năng chủ đề, v.v."
    title="Demo sử dụng component naive"
  >
    <NCard class="mb-5" title="Nút bấm">
      <NSpace>
        <NButton>Default</NButton>
        <NButton type="tertiary"> Tertiary </NButton>
        <NButton type="primary"> Primary </NButton>
        <NButton type="info"> Info </NButton>
        <NButton type="success"> Success </NButton>
        <NButton type="warning"> Warning </NButton>
        <NButton type="error"> Error </NButton>
      </NSpace>
    </NCard>

    <NCard class="mb-5" title="Message">
      <NSpace>
        <NButton type="error" @click="error"> Lỗi </NButton>
        <NButton type="warning" @click="warning"> Cảnh báo </NButton>
        <NButton type="success" @click="success"> Thành công </NButton>
        <NButton type="primary" @click="loading"> Đang tải </NButton>
      </NSpace>
    </NCard>

    <NCard class="mb-5" title="Notification">
      <NSpace>
        <NButton type="error" @click="notify('error')"> Lỗi </NButton>
        <NButton type="warning" @click="notify('warning')"> Cảnh báo </NButton>
        <NButton type="success" @click="notify('success')">
          Thành công
        </NButton>
        <NButton type="primary" @click="notify('info')"> Đang tải </NButton>
      </NSpace>
    </NCard>
  </Page>
</template>
