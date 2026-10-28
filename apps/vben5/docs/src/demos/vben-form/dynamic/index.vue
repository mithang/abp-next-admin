<script lang="ts" setup>
import { message } from 'ant-design-vue';

import { useVbenForm } from '#/adapter/form';

const [Form] = useVbenForm({
  // Hàm submit
  handleSubmit: onSubmit,
  schema: [
    {
      component: 'Input',
      defaultValue: 'hidden value',
      dependencies: {
        show: false,
        // Khi bất kỳ trường nào thay đổi cũng sẽ kích hoạt
        triggerFields: ['field1Switch'],
      },
      fieldName: 'hiddenField',
      label: 'Trường ẩn',
    },
    {
      component: 'Switch',
      defaultValue: true,
      fieldName: 'field1Switch',
      help: 'Hủy qua điều khiển DOM',
      label: 'Trường hiển thị 1',
    },
    {
      component: 'Switch',
      defaultValue: true,
      fieldName: 'field2Switch',
      help: 'Ẩn qua điều khiển CSS',
      label: 'Trường hiển thị 2',
    },
    {
      component: 'Switch',
      fieldName: 'field3Switch',
      label: 'Trường bị vô hiệu hóa 3',
    },
    {
      component: 'Switch',
      fieldName: 'field4Switch',
      label: 'Trường 4 bắt buộc',
    },
    {
      component: 'Input',
      dependencies: {
        if(values) {
          return !!values.field1Switch;
        },
        // Chỉ kích hoạt khi trường được chỉ định thay đổi
        triggerFields: ['field1Switch'],
      },
      // Tên trường
      fieldName: 'field1',
      // Label hiển thị trên giao diện
      label: 'Trường 1',
    },
    {
      component: 'Input',
      dependencies: {
        show(values) {
          return !!values.field2Switch;
        },
        triggerFields: ['field2Switch'],
      },
      fieldName: 'field2',
      label: 'Trường 2',
    },
    {
      component: 'Input',
      dependencies: {
        disabled(values) {
          return !!values.field3Switch;
        },
        triggerFields: ['field3Switch'],
      },
      fieldName: 'field3',
      label: 'Trường 3',
    },
    {
      component: 'Input',
      dependencies: {
        required(values) {
          return !!values.field4Switch;
        },
        triggerFields: ['field4Switch'],
      },
      fieldName: 'field4',
      label: 'Trường 4',
    },
    {
      component: 'Input',
      dependencies: {
        rules(values) {
          if (values.field1 === '123') {
            return 'required';
          }
          return null;
        },
        triggerFields: ['field1'],
      },
      fieldName: 'field5',
      help: 'Bắt buộc khi giá trị trường 1 là `123`',
      label: 'Rules động',
    },
    {
      component: 'Select',
      componentProps: {
        allowClear: true,
        class: 'w-full',
        filterOption: true,
        options: [
          {
            label: 'Tùy chọn 1',
            value: '1',
          },
          {
            label: 'Tùy chọn 2',
            value: '2',
          },
        ],
        placeholder: 'Vui lòng chọn',
        showSearch: true,
      },
      dependencies: {
        componentProps(values) {
          if (values.field2 === '123') {
            return {
              options: [
                {
                  label: 'Tùy chọn 1',
                  value: '1',
                },
                {
                  label: 'Tùy chọn 2',
                  value: '2',
                },
                {
                  label: 'Tùy chọn 3',
                  value: '3',
                },
              ],
            };
          }
          return {};
        },
        triggerFields: ['field2'],
      },
      fieldName: 'field6',
      help: 'Đổi tùy chọn dropdown khi giá trị trường 2 là `123`',
      label: 'Cấu hình động',
    },
  ],
  // Màn hình lớn hiển thị 3 mục mỗi hàng, màn hình vừa 2 mục mỗi hàng, màn hình nhỏ 1 mục mỗi hàng
  wrapperClass: 'grid-cols-1 md:grid-cols-2',
});

function onSubmit(values: Record<string, any>) {
  message.success({
    content: `form values: ${JSON.stringify(values)}`,
  });
}
</script>

<template>
  <Form />
</template>
