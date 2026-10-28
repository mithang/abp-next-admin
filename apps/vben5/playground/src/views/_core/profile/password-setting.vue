<script setup lang="ts">
import type { VbenFormSchema } from '#/adapter/form';

import { computed } from 'vue';

import { ProfilePasswordSetting, z } from '@vben/common-ui';

import { message } from 'ant-design-vue';

const formSchema = computed((): VbenFormSchema[] => {
  return [
    {
      fieldName: 'oldPassword',
      label: 'Mật khẩu cũ',
      component: 'VbenInputPassword',
      componentProps: {
        placeholder: 'Vui lòng nhập mật khẩu cũ',
      },
    },
    {
      fieldName: 'newPassword',
      label: 'Mật khẩu mới',
      component: 'VbenInputPassword',
      componentProps: {
        passwordStrength: true,
        placeholder: 'Vui lòng nhập mật khẩu mới',
      },
    },
    {
      fieldName: 'confirmPassword',
      label: 'Xác nhận mật khẩu',
      component: 'VbenInputPassword',
      componentProps: {
        passwordStrength: true,
        placeholder: 'Vui lòng nhập lại mật khẩu mới',
      },
      dependencies: {
        rules(values) {
          const { newPassword } = values;
          return z
            .string({ required_error: 'Vui lòng nhập lại mật khẩu mới' })
            .min(1, { message: 'Vui lòng nhập lại mật khẩu mới' })
            .refine((value) => value === newPassword, {
              message: 'Hai lần nhập mật khẩu không khớp',
            });
        },
        triggerFields: ['newPassword'],
      },
    },
  ];
});

function handleSubmit() {
  message.success('Đổi mật khẩu thành công');
}
</script>
<template>
  <ProfilePasswordSetting
    class="w-1/3"
    :form-schema="formSchema"
    @submit="handleSubmit"
  />
</template>
