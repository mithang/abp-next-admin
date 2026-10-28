<script lang="ts" setup>
import { h, markRaw } from 'vue';

import { Page } from '@vben/common-ui';

import { Card, Input, message } from 'ant-design-vue';

import { useVbenForm, z } from '#/adapter/form';

import TwoFields from './modules/two-fields.vue';

const [Form] = useVbenForm({
  // Tất cả các mục form dùng chung, có thể ghi đè riêng trong form
  commonConfig: {
    // Tất cả các mục form
    componentProps: {
      class: 'w-full',
    },
    labelClass: 'w-2/6',
  },
  fieldMappingTime: [['field4', ['phoneType', 'phoneNumber'], null]],
  // Hàm submit
  handleSubmit: onSubmit,
  // Bố cục dọc, label và input ở các dòng khác nhau, giá trị là vertical
  // Bố cục ngang, label và input ở cùng một dòng
  layout: 'horizontal',
  schema: [
    {
      // Component cần đăng ký trong #/adapter.ts và thêm kiểu
      component: 'Input',
      fieldName: 'field',
      label: 'Hậu tố tùy chỉnh',
      suffix: () => h('span', { class: 'text-red-600' }, 'đồng'),
    },
    {
      component: 'Input',
      fieldName: 'field1',
      label: 'Component tùy chỉnh (slot)',
      renderComponentContent: () => ({
        prefix: () => 'prefix',
        suffix: () => 'suffix',
      }),
    },
    {
      component: h(Input, { placeholder: 'Vui lòng nhập Field2' }),
      fieldName: 'field2',
      label: 'Component tùy chỉnh',
      modelPropName: 'value',
      rules: 'required',
    },
    {
      component: 'Input',
      fieldName: 'field3',
      label: 'Component tùy chỉnh (slot)',
      rules: 'required',
    },
    {
      component: markRaw(TwoFields),
      defaultValue: [undefined, ''],
      disabledOnChangeListener: false,
      fieldName: 'field4',
      formItemClass: 'col-span-1',
      label: 'Trường kết hợp',
      rules: z
        .array(z.string().optional())
        .length(2, 'Vui lòng chọn loại và nhập số điện thoại')
        .refine((v) => !!v[0], {
          message: 'Vui lòng chọn loại',
        })
        .refine((v) => !!v[1] && v[1] !== '', {
          message: '　　　　　　　Nhập số điện thoại',
        })
        .refine((v) => v[1]?.match(/^1[3-9]\d{9}$/), {
          // Dùng khoảng trắng fullwidth làm chỗ giữ, để đẩy văn bản thông báo lỗi xuống dưới ô nhập số điện thoại
          message: '　　　　　　　Định dạng số không đúng',
        }),
    },
  ],
  // Màn hình trung bình mỗi hàng hiển thị 2 mục, màn hình nhỏ mỗi hàng hiển thị 1 mục
  wrapperClass: 'grid-cols-1 md:grid-cols-2',
});

function onSubmit(values: Record<string, any>) {
  message.success({
    content: `form values: ${JSON.stringify(values)}`,
  });
}
</script>

<template>
  <Page description="Ví dụ tùy chỉnh component form" title="Component form">
    <Card title="Ví dụ cơ bản">
      <Form>
        <template #field3="slotProps">
          <Input placeholder="Vui lòng nhập" v-bind="slotProps" />
        </template>
      </Form>
    </Card>
  </Page>
</template>
