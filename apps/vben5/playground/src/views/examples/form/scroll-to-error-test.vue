<script lang="ts" setup>
import { ref } from 'vue';

import { Page } from '@vben/common-ui';

import { Button, Card, Switch } from 'ant-design-vue';

import { useVbenForm } from '#/adapter/form';

defineOptions({
  name: 'ScrollToErrorTest',
});

const scrollEnabled = ref(true);

const [Form, formApi] = useVbenForm({
  scrollToFirstError: scrollEnabled.value,
  schema: [
    {
      component: 'Input',
      componentProps: {
        placeholder: 'Vui lòng nhập tên người dùng',
      },
      fieldName: 'username',
      label: 'Tên người dùng',
      rules: 'required',
    },
    {
      component: 'Input',
      componentProps: {
        placeholder: 'Vui lòng nhập email',
      },
      fieldName: 'email',
      label: 'Email',
      rules: 'required',
    },
    {
      component: 'Input',
      componentProps: {
        placeholder: 'Vui lòng nhập số điện thoại',
      },
      fieldName: 'phone',
      label: 'Số điện thoại',
      rules: 'required',
    },
    {
      component: 'Input',
      componentProps: {
        placeholder: 'Vui lòng nhập địa chỉ',
      },
      fieldName: 'address',
      label: 'Địa chỉ',
      rules: 'required',
    },
    {
      component: 'Input',
      componentProps: {
        placeholder: 'Vui lòng nhập ghi chú',
      },
      fieldName: 'remark',
      label: 'Ghi chú',
      rules: 'required',
    },
    {
      component: 'Input',
      componentProps: {
        placeholder: 'Vui lòng nhập tên công ty',
      },
      fieldName: 'company',
      label: 'Tên công ty',
      rules: 'required',
    },
    {
      component: 'Input',
      componentProps: {
        placeholder: 'Vui lòng nhập chức vụ',
      },
      fieldName: 'position',
      label: 'Chức vụ',
      rules: 'required',
    },
    {
      component: 'Select',
      componentProps: {
        options: [
          { label: 'Nam', value: 'male' },
          { label: 'Nữ', value: 'female' },
        ],
        placeholder: 'Vui lòng chọn giới tính',
      },
      fieldName: 'gender',
      label: 'Giới tính',
      rules: 'selectRequired',
    },
  ],
  showDefaultActions: false,
});

// Kiểm thử validateAndSubmitForm (xác thực và gửi)
async function testValidateAndSubmit() {
  await formApi.validateAndSubmitForm();
}

// Kiểm thử validate (xác thực thủ công toàn bộ biểu mẫu)
async function testValidate() {
  await formApi.validate();
}

// Kiểm thử validateField (xác thực một trường duy nhất)
async function testValidateField() {
  await formApi.validateField('username');
}

// Chuyển đổi chức năng cuộn
function toggleScrollToError() {
  formApi.setState({ scrollToFirstError: scrollEnabled.value });
}

// Kiểm thử điền một phần dữ liệu
async function fillPartialData() {
  await formApi.resetForm();
  await formApi.setFieldValue('username', 'Người dùng kiểm thử');
  await formApi.setFieldValue('email', 'test@example.com');
}
</script>

<template>
  <Page
    description="Kiểm thử chức năng tự động cuộn đến trường lỗi khi xác thực biểu mẫu thất bại"
    title="Kiểm thử cuộn đến trường lỗi"
  >
    <Card title="Kiểm thử chức năng">
      <template #extra>
        <div class="flex items-center gap-2">
          <Switch v-model="scrollEnabled" @change="toggleScrollToError" />
          <span>Bật cuộn đến trường lỗi</span>
        </div>
      </template>

      <div class="space-y-4">
        <div class="rounded bg-blue-50 p-4">
          <h3 class="mb-2 font-medium">Hướng dẫn kiểm thử：</h3>
          <ul class="list-inside list-disc space-y-1 text-sm">
            <li>
              Tất cả phương thức xác thực đều tự động cuộn đến trường lỗi đầu
              tiên khi xác thực thất bại
            </li>
            <li>
              Có thể bật/tắt chức năng tự động cuộn bằng công tắc ở góc trên bên
              phải
            </li>
          </ul>
        </div>

        <div class="rounded border p-4">
          <h4 class="mb-3 font-medium">Kiểm thử phương thức xác thực：</h4>
          <div class="flex flex-wrap gap-2">
            <Button type="primary" @click="testValidateAndSubmit">
              Kiểm thử validateAndSubmitForm()
            </Button>
            <Button @click="testValidate"> Kiểm thử validate() </Button>
            <Button @click="testValidateField">
              Kiểm thử validateField()
            </Button>
          </div>
          <div class="mt-2 text-xs text-gray-500">
            <p>• validateAndSubmitForm(): Xác thực biểu mẫu và gửi</p>
            <p>• validate(): Xác thực thủ công toàn bộ biểu mẫu</p>
            <p>
              • validateField(): Xác thực một trường duy nhất (ở đây kiểm thử
              trường tên người dùng)
            </p>
          </div>
        </div>

        <div class="rounded border p-4">
          <h4 class="mb-3 font-medium">Kiểm thử điền dữ liệu：</h4>
          <div class="flex flex-wrap gap-2">
            <Button @click="fillPartialData"> Điền một phần dữ liệu </Button>
            <Button @click="() => formApi.resetForm()"> Xóa biểu mẫu </Button>
          </div>
          <div class="mt-2 text-xs text-gray-500">
            <p>
              • Sau khi điền một phần dữ liệu rồi xác thực, sẽ cuộn đến trường
              lỗi đầu tiên
            </p>
          </div>
        </div>

        <Form />
      </div>
    </Card>
  </Page>
</template>
