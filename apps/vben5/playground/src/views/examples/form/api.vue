<script lang="ts" setup>
import type { RefSelectProps } from 'ant-design-vue/es/select';

import { ref } from 'vue';

import { Page } from '@vben/common-ui';

import { Button, Card, message, Space } from 'ant-design-vue';

import { useVbenForm } from '#/adapter/form';

const isReverseActionButtons = ref(false);

const [BaseForm, formApi] = useVbenForm({
  // Đảo ngược vị trí nút thao tác
  actionButtonsReverse: isReverseActionButtons.value,
  // Dùng chung cho tất cả các trường biểu mẫu, có thể ghi đè riêng trong biểu mẫu
  commonConfig: {
    // Tất cả các trường biểu mẫu
    componentProps: {
      class: 'w-full',
    },
  },
  // Sử dụng bố cục grid tailwindcss
  // Hàm gửi
  handleSubmit: onSubmit,
  // Bố cục dọc, label và input ở các dòng khác nhau, giá trị là vertical
  layout: 'horizontal',
  // Bố cục ngang, label và input trên cùng một dòng
  schema: [
    {
      // Component cần đăng ký trong #/adapter.ts và thêm kiểu
      component: 'Input',
      // Tham số của component tương ứng
      componentProps: {
        placeholder: 'Vui lòng nhập tên người dùng',
      },
      // Tên trường
      fieldName: 'field1',
      // label hiển thị trên giao diện
      label: 'field1',
    },
    {
      component: 'Input',
      componentProps: {
        placeholder: 'Vui lòng nhập',
      },
      fieldName: 'field2',
      label: 'field2',
    },
    {
      component: 'Select',
      componentProps: {
        allowClear: true,
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
      fieldName: 'fieldOptions',
      label: 'Danh sách thả xuống',
    },
  ],
  // Màn hình lớn hiển thị 3 mục mỗi dòng, màn hình vừa hiển thị 2 mục mỗi dòng, màn hình nhỏ hiển thị 1 mục mỗi dòng
  wrapperClass: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
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
    | 'componentRef'
    | 'disabled'
    | 'hiddenAction'
    | 'hiddenResetButton'
    | 'hiddenSubmitButton'
    | 'labelWidth'
    | 'resetDisabled'
    | 'resetLabelWidth'
    | 'reverseActionButtons'
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
        for (let i = 0; i < 3; i++) {
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
          schema: currentSchema.slice(0, -3),
        };
      });
      break;
    }
    case 'componentRef': {
      // Lấy thể hiện của component thả xuống và gọi phương thức focus của nó
      formApi.getFieldComponentRef<RefSelectProps>('fieldOptions')?.focus?.();
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
    case 'reverseActionButtons': {
      isReverseActionButtons.value = !isReverseActionButtons.value;
      formApi.setState({ actionButtonsReverse: isReverseActionButtons.value });
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
          },
          fieldName: 'fieldOptions',
        },
      ]);
      message.success(
        'Trường `fieldOptions` cập nhật tùy chọn thả xuống thành công.',
      );
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
  <Page
    description="Ví dụ thao tác api component biểu mẫu."
    title="Component biểu mẫu"
  >
    <Space class="mb-5 flex-wrap">
      <Button @click="handleClick('updateSchema')">updateSchema</Button>
      <Button @click="handleClick('labelWidth')">Thay đổi labelWidth</Button>
      <Button @click="handleClick('resetLabelWidth')">
        Khôi phục labelWidth
      </Button>
      <Button @click="handleClick('disabled')">Vô hiệu hóa biểu mẫu</Button>
      <Button @click="handleClick('resetDisabled')">Hủy vô hiệu hóa</Button>
      <Button @click="handleClick('reverseActionButtons')">
        Đảo ngược vị trí nút thao tác
      </Button>
      <Button @click="handleClick('hiddenAction')">Ẩn nút thao tác</Button>
      <Button @click="handleClick('showAction')">Hiển thị nút thao tác</Button>
      <Button @click="handleClick('hiddenResetButton')">Ẩn nút đặt lại</Button>
      <Button @click="handleClick('showResetButton')">
        Hiển thị nút đặt lại
      </Button>
      <Button @click="handleClick('hiddenSubmitButton')">Ẩn nút gửi</Button>
      <Button @click="handleClick('showSubmitButton')">Hiển thị nút gửi</Button>
      <Button @click="handleClick('updateResetButton')">Sửa nút đặt lại</Button>
      <Button @click="handleClick('updateSubmitButton')">Sửa nút gửi</Button>
      <Button @click="handleClick('updateActionAlign')">
        Điều chỉnh vị trí nút thao tác
      </Button>
      <Button @click="handleClick('batchAddSchema')">
        Thêm hàng loạt trường biểu mẫu
      </Button>
      <Button @click="handleClick('batchDeleteSchema')">
        Xóa hàng loạt trường biểu mẫu
      </Button>
      <Button @click="handleClick('componentRef')">
        Component thả xuống nhận tiêu điểm
      </Button>
    </Space>
    <Card title="Ví dụ thao tác">
      <BaseForm />
    </Card>
  </Page>
</template>
