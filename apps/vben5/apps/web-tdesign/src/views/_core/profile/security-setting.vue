<script setup lang="ts">
import { computed } from 'vue';

import { ProfileSecuritySetting } from '@vben/common-ui';

const formSchema = computed(() => {
  return [
    {
      value: true,
      fieldName: 'accountPassword',
      label: 'Mật khẩu tài khoản',
      description: 'Độ mạnh mật khẩu hiện tại: Mạnh',
    },
    {
      value: true,
      fieldName: 'securityPhone',
      label: 'Điện thoại bảo mật',
      description: 'Đã liên kết điện thoại: 138****8293',
    },
    {
      value: true,
      fieldName: 'securityQuestion',
      label: 'Câu hỏi bảo mật',
      description:
        'Chưa đặt câu hỏi bảo mật, câu hỏi bảo mật có thể bảo vệ tài khoản hiệu quả',
    },
    {
      value: true,
      fieldName: 'securityEmail',
      label: 'Email dự phòng',
      description: 'Đã liên kết email: ant***sign.com',
    },
    {
      value: false,
      fieldName: 'securityMfa',
      label: 'Thiết bị MFA',
      description:
        'Chưa liên kết thiết bị MFA, sau khi liên kết có thể xác nhận lần hai',
    },
  ];
});
</script>
<template>
  <ProfileSecuritySetting :form-schema="formSchema" />
</template>
