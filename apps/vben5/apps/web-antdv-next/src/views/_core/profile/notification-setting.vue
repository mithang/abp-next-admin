<script setup lang="ts">
import { computed } from 'vue';

import { ProfileNotificationSetting } from '@vben/common-ui';

const formSchema = computed(() => {
  return [
    {
      value: true,
      fieldName: 'accountPassword',
      label: 'Mật khẩu tài khoản',
      description:
        'Tin nhắn của người dùng khác sẽ được thông báo dưới dạng thư nội bộ',
    },
    {
      value: true,
      fieldName: 'systemMessage',
      label: 'Tin nhắn hệ thống',
      description: 'Tin nhắn hệ thống sẽ được thông báo dưới dạng thư nội bộ',
    },
    {
      value: true,
      fieldName: 'todoTask',
      label: 'Nhiệm vụ cần làm',
      description: 'Nhiệm vụ cần làm sẽ được thông báo dưới dạng thư nội bộ',
    },
  ];
});
</script>
<template>
  <ProfileNotificationSetting :form-schema="formSchema" />
</template>
