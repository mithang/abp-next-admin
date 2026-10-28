<script lang="ts" setup>
import { Button, message, Space } from 'ant-design-vue';

import { useVbenForm } from '#/adapter/form';

const [BaseForm, formApi] = useVbenForm({
  // Tất cả các trường form dùng chung, có thể ghi đè riêng trong form
  commonConfig: {
    // Tất cả các trường form
    componentProps: {
      class: 'w-full',
    },
  },
  // Dùng bố cục grid của tailwindcss
  // Hàm gửi form
  handleSubmit: onSubmit,
  // Bố cục dọc, label và input ở các dòng khác nhau, giá trị là vertical
  layout: 'horizontal',
  // Bố cục ngang, label và input ở cùng một dòng
  schema: [
    {
      // Component cần đăng ký trong #/adapter.ts và kèm thêm kiểu
      component: 'Input',
      // Tham số của component tương ứng
      componentProps: {
        placeholder: 'Vui lòng nhập tên người dùng',
      },
      // Tên trường
      fieldName: 'field1',
      // Label hiển thị trên giao diện
      label: 'field1',
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
      fieldName: 'fieldOptions',
      label: 'Chọn thả xuống',
    },
  ],
  wrapperClass: 'grid-cols-1 md:grid-cols-2',
});

function onSubmit(values: Record<string, any>) {
  message.success({
    content: `form values: ${JSON.stringify(values)}`,
  });
}

function handleClick(
  action:
    | 'batchAddSchema'
    | 'batchDeleteSchema'
    | 'disabled'
    | 'hiddenAction'
    | 'hiddenResetButton'
    | 'hiddenSubmitButton'
    | 'labelWidth'
    | 'resetDisabled'
    | 'resetLabelWidth'
    | 'showAction'
    | 'showResetButton'
    | 'showSubmitButton'
    | 'updateActionAlign'
    | 'updateResetButton'
    | 'updateSchema'
    | 'updateSubmitButton',
) {
  switch (action) {
    case 'batchAddSchema': {
      formApi.setState((prev) => {
        const currentSchema = prev?.schema ?? [];
        const newSchema = [];
        for (let i = 0; i < 2; i++) {
          newSchema.push({
            component: 'Input',
            componentProps: {
              placeholder: 'Vui lòng nhập',
            },
            fieldName: `field${i}${Date.now()}`,
            label: `field+`,
          });
        }
        return {
          schema: [...currentSchema, ...newSchema],
        };
      });
      break;
    }

    case 'batchDeleteSchema': {
      formApi.setState((prev) => {
        const currentSchema = prev?.schema ?? [];
        return {
          schema: currentSchema.slice(0, -2),
        };
      });
      break;
    }
    case 'disabled': {
      formApi.setState({ commonConfig: { disabled: true } });
      break;
    }
    case 'hiddenAction': {
      formApi.setState({ showDefaultActions: false });
      break;
    }
    case 'hiddenResetButton': {
      formApi.setState({ resetButtonOptions: { show: false } });
      break;
    }
    case 'hiddenSubmitButton': {
      formApi.setState({ submitButtonOptions: { show: false } });
      break;
    }
    case 'labelWidth': {
      formApi.setState({
        commonConfig: {
          labelWidth: 150,
        },
      });
      break;
    }
    case 'resetDisabled': {
      formApi.setState({ commonConfig: { disabled: false } });
      break;
    }
    case 'resetLabelWidth': {
      formApi.setState({
        commonConfig: {
          labelWidth: 100,
        },
      });
      break;
    }
    case 'showAction': {
      formApi.setState({ showDefaultActions: true });
      break;
    }
    case 'showResetButton': {
      formApi.setState({ resetButtonOptions: { show: true } });
      break;
    }
    case 'showSubmitButton': {
      formApi.setState({ submitButtonOptions: { show: true } });
      break;
    }
    case 'updateActionAlign': {
      formApi.setState({
        // Có thể tự điều chỉnh class
        actionWrapperClass: 'text-center',
      });
      break;
    }
    case 'updateResetButton': {
      formApi.setState({
        resetButtonOptions: { disabled: true },
      });
      break;
    }
    case 'updateSchema': {
      formApi.updateSchema([
        {
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
              {
                label: 'Lựa chọn 3',
                value: '3',
              },
            ],
          },
          fieldName: 'fieldOptions',
        },
      ]);
      message.success('Cập nhật thành công các lựa chọn thả xuống của trường `fieldOptions`.');
      break;
    }
    case 'updateSubmitButton': {
      formApi.setState({
        submitButtonOptions: { loading: true },
      });
      break;
    }
  }
}
</script>

<template>
  <div>
    <Space class="mb-5 flex-wrap">
      <Button @click="handleClick('updateSchema')">updateSchema</Button>
      <Button @click="handleClick('labelWidth')">Thay đổi labelWidth</Button>
      <Button @click="handleClick('resetLabelWidth')">Khôi phục labelWidth</Button>
      <Button @click="handleClick('disabled')">Vô hiệu hoá form</Button>
      <Button @click="handleClick('resetDisabled')">Bỏ vô hiệu hoá</Button>
      <Button @click="handleClick('hiddenAction')">Ẩn nút thao tác</Button>
      <Button @click="handleClick('showAction')">Hiện nút thao tác</Button>
      <Button @click="handleClick('hiddenResetButton')">Ẩn nút đặt lại</Button>
      <Button @click="handleClick('showResetButton')">Hiện nút đặt lại</Button>
      <Button @click="handleClick('hiddenSubmitButton')">Ẩn nút gửi</Button>
      <Button @click="handleClick('showSubmitButton')">Hiện nút gửi</Button>
      <Button @click="handleClick('updateResetButton')">Sửa nút đặt lại</Button>
      <Button @click="handleClick('updateSubmitButton')">Sửa nút gửi</Button>
      <Button @click="handleClick('updateActionAlign')">
        Điều chỉnh vị trí nút thao tác
      </Button>
      <Button @click="handleClick('batchAddSchema')"> Thêm hàng loạt trường form </Button>
      <Button @click="handleClick('batchDeleteSchema')">
        Xoá hàng loạt trường form
      </Button>
    </Space>
    <BaseForm />
  </div>
</template>
