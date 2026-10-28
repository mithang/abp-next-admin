<script setup lang="ts">
import type { IdentityClaimDto } from '../../types/claims';
import type { ClaimEditModalProps } from './types';

import { useVbenForm, useVbenModal } from '@vben/common-ui';
import { $t } from '@vben/locales';

import { useClaimTypesApi } from '../../api/useClaimTypesApi';

defineOptions({
  name: 'ClaimModal',
});

const { createApi, updateApi } = defineProps<ClaimEditModalProps>();
const emits = defineEmits<{
  (event: 'change', data: IdentityClaimDto): void;
}>();
const { cancel, getAssignableClaimsApi } = useClaimTypesApi();
const [Form, formApi] = useVbenForm({
  commonConfig: {
    // Tất cả các mục form
    componentProps: {
      class: 'w-full',
    },
  },
  handleSubmit: onSubmit,
  schema: [
    {
      component: 'Select',
      fieldName: 'claimType',
      label: $t('AbpIdentity.DisplayName:ClaimType'),
      rules: 'required',
    },
    {
      component: 'Textarea',
      fieldName: 'claimValue',
      label: $t('AbpIdentity.DisplayName:ClaimValue'),
      rules: 'required',
    },
  ],
  showDefaultActions: false,
});
const [Modal, modalApi] = useVbenModal({
  draggable: true,
  fullscreenButton: false,
  onClosed() {
    cancel('Claim modal has closed!');
  },
  async onConfirm() {
    await formApi.validateAndSubmitForm();
  },
  async onOpenChange(isOpen: boolean) {
    if (isOpen) {
      try {
        modalApi.setState({ loading: true });
        const claimDto = modalApi.getData<IdentityClaimDto>();
        formApi.setValues({
          ...claimDto,
          newClaimValue: claimDto.claimValue,
        });
        // Khi thêm mới thì có thể chọn, khi sửa thì không thể chọn
        formApi.updateSchema([
          {
            disabled: !!claimDto.id,
            fieldName: 'claimType',
          },
        ]);
        // Khi thêm mới, khởi tạo khai báo có thể chọn
        !claimDto.id && (await initAssignableClaims());
      } finally {
        modalApi.setState({ loading: false });
      }
    }
  },
  title: $t('AbpIdentity.ManageClaim'),
});
/** Khởi tạo loại khai báo khả dụng */
async function initAssignableClaims() {
  const { items } = await getAssignableClaimsApi();
  formApi.updateSchema([
    {
      componentProps: {
        fieldNames: {
          label: 'name',
          value: 'name',
        },
        options: items,
      },
      fieldName: 'claimType',
    },
  ]);
}
/** Gửi thay đổi loại khai báo */
async function onSubmit(values: Record<string, any>) {
  try {
    modalApi.setState({ submitting: true });
    const claimDto = modalApi.getData<IdentityClaimDto>();
    const api = claimDto.id
      ? updateApi({
          claimType: claimDto.claimType,
          claimValue: claimDto.claimValue,
          newClaimValue: values.claimValue,
        })
      : createApi({
          claimType: values.claimType,
          claimValue: values.claimValue,
        });
    await api;
    emits('change', values as IdentityClaimDto);
    modalApi.close();
  } finally {
    modalApi.setState({ submitting: false });
  }
}
</script>

<template>
  <Modal>
    <Form />
  </Modal>
</template>

<style scoped></style>
