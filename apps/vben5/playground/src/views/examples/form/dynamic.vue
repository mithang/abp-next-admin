<script lang="ts" setup>
import { Page } from '@vben/common-ui';

import { Button, Card, message } from 'ant-design-vue';

import { useVbenForm } from '#/adapter/form';

const [Form, formApi] = useVbenForm({
  // Hàm gửi
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
      label: 'Ẩn trường',
    },
    {
      component: 'Switch',
      defaultValue: true,
      fieldName: 'field1Switch',
      help: 'Hủy qua điều khiển Dom',
      label: 'Hiển thị trường 1',
    },
    {
      component: 'Switch',
      defaultValue: true,
      fieldName: 'field2Switch',
      help: 'Ẩn qua điều khiển css',
      label: 'Hiển thị trường 2',
    },
    {
      component: 'Switch',
      fieldName: 'field3Switch',
      label: 'Vô hiệu hóa trường 3',
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
        // Chỉ khi trường được chỉ định thay đổi mới kích hoạt
        triggerFields: ['field1Switch'],
      },
      // Tên trường
      fieldName: 'field1',
      // label hiển thị trên giao diện
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
      help: 'Khi giá trị trường 1 là `123` thì bắt buộc',
      label: 'rules động',
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
      help: 'Khi giá trị trường 2 là `123` thì thay đổi tùy chọn thả xuống',
      label: 'Cấu hình động',
    },
    {
      component: 'Input',
      fieldName: 'field7',
      label: 'Trường 7',
    },
  ],
  // Màn hình lớn hiển thị 3 mục mỗi dòng, màn hình vừa hiển thị 2 mục mỗi dòng, màn hình nhỏ hiển thị 1 mục mỗi dòng
  wrapperClass: 'grid-cols-1 md:grid-cols-3 lg:grid-cols-4',
});

const [SyncForm] = useVbenForm({
  handleSubmit: onSubmit,
  schema: [
    {
      component: 'Input',
      // Tên trường
      fieldName: 'field1',
      // label hiển thị trên giao diện
      label: 'Trường 1',
    },
    {
      component: 'Input',
      componentProps: {
        disabled: true,
      },
      dependencies: {
        trigger(values, form) {
          form.setFieldValue('field2', values.field1);
        },
        // Chỉ khi trường được chỉ định thay đổi mới kích hoạt
        triggerFields: ['field1'],
      },
      // Tên trường
      fieldName: 'field2',
      // label hiển thị trên giao diện
      label: 'Trường 2',
    },
  ],
  // Màn hình lớn hiển thị 3 mục mỗi dòng, màn hình vừa hiển thị 2 mục mỗi dòng, màn hình nhỏ hiển thị 1 mục mỗi dòng
  wrapperClass: 'grid-cols-1 md:grid-cols-3 lg:grid-cols-4',
});

function onSubmit(values: Record<string, any>) {
  message.success({
    content: `form values: ${JSON.stringify(values)}`,
  });
}

function handleDelete() {
  formApi.setState((prev) => {
    return {
      schema: prev.schema?.filter((item) => item.fieldName !== 'field7'),
    };
  });
}

function handleAdd() {
  formApi.setState((prev) => {
    return {
      schema: [
        ...(prev?.schema ?? []),
        {
          component: 'Input',
          fieldName: `field${Date.now()}`,
          label: 'Trường+',
        },
      ],
    };
  });
}

function handleUpdate() {
  formApi.setState((prev) => {
    return {
      schema: prev.schema?.map((item) => {
        if (item.fieldName === 'field3') {
          return {
            ...item,
            label: 'Trường 3 - sửa',
          };
        }
        return item;
      }),
    };
  });
}
</script>

<template>
  <Page
    description="Ví dụ liên động động của component biểu mẫu, bao gồm các tình huống thường dùng. Thêm/xóa/sửa về bản chất là sửa schema, bạn cũng có thể sửa schema động qua `setState`."
    title="Component biểu mẫu"
  >
    <Card title="Ví dụ liên động động của biểu mẫu">
      <template #extra>
        <Button class="mr-2" @click="handleUpdate">Sửa trường 3</Button>
        <Button class="mr-2" @click="handleDelete">Xóa trường 7</Button>
        <Button @click="handleAdd">Thêm trường</Button>
      </template>
      <Form />
    </Card>

    <Card
      class="mt-5"
      title="Đồng bộ trường, dữ liệu trường 1 đồng bộ với dữ liệu trường 2"
    >
      <SyncForm />
    </Card>
  </Page>
</template>
