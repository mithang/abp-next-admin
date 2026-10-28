<script lang="ts" setup>
import { useVbenDrawer } from '@vben/common-ui';

import { useVbenForm } from '#/adapter/form';

defineOptions({
  name: 'FormDrawerDemo',
});

const [Form, formApi] = useVbenForm({
  schema: [
    {
      component: 'Input',
      componentProps: {
        placeholder: 'Vui lòng nhập',
      },
      fieldName: 'field1',
      label: 'Trường 1',
      rules: 'required',
    },
    {
      component: 'Input',
      componentProps: {
        placeholder: 'Vui lòng nhập',
      },
      fieldName: 'field2',
      label: 'Trường 2',
      rules: 'required',
    },
  ],
  showDefaultActions: false,
});
const [Drawer, drawerApi] = useVbenDrawer({
  onCancel() {
    drawerApi.close();
  },
  onConfirm: async () => {
    await formApi.submitForm();
    drawerApi.close();
  },
  onOpenChange(isOpen: boolean) {
    if (isOpen) {
      const { values } = drawerApi.getData<Record<string, any>>();
      if (values) {
        formApi.setValues(values);
      }
    }
  },
  title: 'Ví dụ biểu mẫu nhúng',
});
</script>
<template>
  <Drawer>
    <Form />
  </Drawer>
</template>
