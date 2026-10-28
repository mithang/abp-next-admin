<script lang="ts" setup>
import { message } from 'ant-design-vue';

import { useVbenForm } from '#/adapter/form';

const [BaseForm] = useVbenForm({
  // Dùng chung cho mọi trường form, có thể ghi đè riêng trong form
  commonConfig: {
    // Mọi trường form
    componentProps: {
      class: 'w-full',
    },
  },
  // Hàm gửi
  handleSubmit: onSubmit,
  // Bố cục dọc, label và input ở các dòng khác nhau, giá trị là vertical
  // Bố cục ngang, label và input trên cùng một dòng
  layout: 'horizontal',
  schema: [
    {
      // Component cần đăng ký trong #/adapter.ts và thêm kiểu
      component: 'Input',
      // Tham số của component tương ứng
      componentProps: {
        placeholder: 'Vui lòng nhập tên người dùng',
      },
      // Tên trường
      fieldName: 'username',
      // Label hiển thị trên giao diện
      label: 'Chuỗi',
    },
    {
      component: 'InputPassword',
      componentProps: {
        placeholder: 'Vui lòng nhập mật khẩu',
      },
      fieldName: 'password',
      label: 'Mật khẩu',
    },
    {
      component: 'InputNumber',
      componentProps: {
        placeholder: 'Vui lòng nhập',
      },
      fieldName: 'number',
      label: 'Số (có hậu tố)',
      suffix: () => '¥',
    },
    {
      component: 'Select',
      componentProps: {
        allowClear: true,
        filterOption: true,
        options: [
          {
            label: 'Lựa chọn 1',
            value: '1',
          },
          {
            label: 'Lựa chọn 2',
            value: '2',
          },
        ],
        placeholder: 'Vui lòng chọn',
        showSearch: true,
      },
      fieldName: 'options',
      label: 'Chọn thả xuống',
    },
    {
      component: 'RadioGroup',
      componentProps: {
        options: [
          {
            label: 'Lựa chọn 1',
            value: '1',
          },
          {
            label: 'Lựa chọn 2',
            value: '2',
          },
        ],
      },
      fieldName: 'radioGroup',
      label: 'Nhóm chọn một',
    },
    {
      component: 'Radio',
      fieldName: 'radio',
      label: '',
      renderComponentContent: () => {
        return {
          default: () => ['Radio'],
        };
      },
    },
    {
      component: 'CheckboxGroup',
      componentProps: {
        name: 'cname',
        options: [
          {
            label: 'Lựa chọn 1',
            value: '1',
          },
          {
            label: 'Lựa chọn 2',
            value: '2',
          },
        ],
      },
      fieldName: 'checkboxGroup',
      label: 'Nhóm chọn nhiều',
    },
    {
      component: 'Checkbox',
      fieldName: 'checkbox',
      label: '',
      renderComponentContent: () => {
        return {
          default: () => ['Tôi đã đọc và đồng ý'],
        };
      },
    },
    {
      component: 'Mentions',
      componentProps: {
        options: [
          {
            label: 'afc163',
            value: 'afc163',
          },
          {
            label: 'zombieJ',
            value: 'zombieJ',
          },
        ],
        placeholder: 'Vui lòng nhập',
      },
      fieldName: 'mentions',
      label: 'Nhắc đến',
    },
    {
      component: 'Rate',
      fieldName: 'rate',
      label: 'Đánh giá',
    },
    {
      component: 'Switch',
      componentProps: {
        class: 'w-auto',
      },
      fieldName: 'switch',
      label: 'Công tắc',
    },
    {
      component: 'DatePicker',
      fieldName: 'datePicker',
      label: 'Hộp chọn ngày',
    },
    {
      component: 'RangePicker',
      fieldName: 'rangePicker',
      label: 'Bộ chọn khoảng',
    },
    {
      component: 'TimePicker',
      fieldName: 'timePicker',
      label: 'Hộp chọn thời gian',
    },
    {
      component: 'TreeSelect',
      componentProps: {
        allowClear: true,
        placeholder: 'Vui lòng chọn',
        showSearch: true,
        treeData: [
          {
            label: 'root 1',
            value: 'root 1',
            children: [
              {
                label: 'parent 1',
                value: 'parent 1',
                children: [
                  {
                    label: 'parent 1-0',
                    value: 'parent 1-0',
                    children: [
                      {
                        label: 'my leaf',
                        value: 'leaf1',
                      },
                      {
                        label: 'your leaf',
                        value: 'leaf2',
                      },
                    ],
                  },
                  {
                    label: 'parent 1-1',
                    value: 'parent 1-1',
                  },
                ],
              },
              {
                label: 'parent 2',
                value: 'parent 2',
              },
            ],
          },
        ],
        treeNodeFilterProp: 'label',
      },
      fieldName: 'treeSelect',
      label: 'Chọn cây',
    },
  ],
  wrapperClass: 'grid-cols-1',
});

function onSubmit(values: Record<string, any>) {
  message.success({
    content: `form values: ${JSON.stringify(values)}`,
  });
}
</script>

<template>
  <BaseForm />
</template>
