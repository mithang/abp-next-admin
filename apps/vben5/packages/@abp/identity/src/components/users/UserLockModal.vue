<!-- eslint-disable no-unused-vars -->
<script setup lang="ts">
import type { IdentityUserDto } from '../../types/users';

import { useVbenForm, useVbenModal } from '@vben/common-ui';
import { $t } from '@vben/locales';

import { useUsersApi } from '../../api/useUsersApi';

defineOptions({
  name: 'UserLockModal',
});
const emits = defineEmits<{
  (event: 'change'): void;
}>();

enum LockType {
  Days = 86_400,
  Hours = 3600,
  Minutes = 60,
  Months = 2_678_400, // Tính theo 31 ngày
  Seconds = 1,
  Years = 32_140_800, // Tính theo 31*12 ngày
}

const { cancel, lockApi } = useUsersApi();
const [Form, formApi] = useVbenForm({
  commonConfig: {
    // Tất cả các mục biểu mẫu
    componentProps: {
      class: 'w-full',
    },
  },
  handleSubmit: onSubmit,
  schema: [
    {
      component: 'Input',
      componentProps: {
        style: {
          display: 'none',
        },
      },
      fieldName: 'userId',
    },
    {
      component: 'InputNumber',
      fieldName: 'seconds',
      label: $t('AbpIdentity.LockTime'),
      rules: 'required',
    },
    {
      component: 'Select',
      componentProps: {
        options: [
          // TODO: Bản địa hóa
          {
            label: $t('AbpIdentity.LockType:Seconds'),
            value: LockType.Seconds,
          },
          {
            label: $t('AbpIdentity.LockType:Minutes'),
            value: LockType.Minutes,
          },
          { label: $t('AbpIdentity.LockType:Hours'), value: LockType.Hours },
          { label: $t('AbpIdentity.LockType:Days'), value: LockType.Days },
          { label: $t('AbpIdentity.LockType:Months'), value: LockType.Months },
          { label: $t('AbpIdentity.LockType:Years'), value: LockType.Years },
        ],
      },
      defaultValue: LockType.Seconds,
      fieldName: 'type',
      label: $t('AbpIdentity.LockType'),
      rules: 'required',
    },
  ],
  showDefaultActions: false,
});

const [Modal, modalApi] = useVbenModal({
  closeOnClickModal: false,
  closeOnPressEscape: false,
  draggable: true,
  fullscreenButton: false,
  onCancel() {
    modalApi.close();
  },
  onClosed() {
    cancel('User lock modal has closed!');
  },
  onConfirm: async () => {
    await formApi.validateAndSubmitForm();
  },
  async onOpenChange(isOpen: boolean) {
    let title = $t('AbpIdentity.Lock');
    if (isOpen) {
      const { id, userName } = modalApi.getData<IdentityUserDto>();
      title += ` - ${userName}`;
      formApi.setValues({
        userId: id,
      });
    }
    modalApi.setState({ title });
  },
  title: $t('AbpIdentity.Lock'),
});

async function onSubmit(input: Record<string, any>) {
  try {
    modalApi.setState({
      submitting: true,
    });
    const lockSeconds = input.type * input.seconds;
    await lockApi(input.userId, lockSeconds);
    emits('change');
    modalApi.close();
  } finally {
    modalApi.setState({
      submitting: false,
    });
  }
}
</script>

<template>
  <Modal>
    <Form />
  </Modal>
</template>

<style scoped></style>
