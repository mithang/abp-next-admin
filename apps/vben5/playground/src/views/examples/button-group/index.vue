<script lang="ts" setup>
import type { Recordable } from '@vben/types';

import { reactive, ref } from 'vue';

import {
  Page,
  VbenButton,
  VbenButtonGroup,
  VbenCheckButtonGroup,
} from '@vben/common-ui';
import { LoaderCircle, Square, SquareCheckBig } from '@vben/icons';

import { Button, Card, message } from 'ant-design-vue';

import { useVbenForm } from '#/adapter/form';

const radioValue = ref<string | undefined>('a');
const checkValue = ref(['a', 'b']);

const options = [
  { label: 'Lựa chọn 1', value: 'a' },
  { label: 'Lựa chọn 2', value: 'b', num: 999 },
  { label: 'Lựa chọn 3', value: 'c' },
  { label: 'Lựa chọn 4', value: 'd' },
  { label: 'Lựa chọn 5', value: 'e' },
  { label: 'Lựa chọn 6', value: 'f' },
];

function resetValues() {
  radioValue.value = undefined;
  checkValue.value = [];
}

function beforeChange(v: any, isChecked: boolean) {
  return new Promise((resolve) => {
    message.loading({
      content: `Đang đặt ${v} thành ${isChecked ? 'đã chọn' : 'chưa chọn'}...`,
      duration: 0,
      key: 'beforeChange',
    });
    setTimeout(() => {
      message.success({
        content: `${v} đã đặt thành công`,
        key: 'beforeChange',
      });
      resolve(true);
    }, 2000);
  });
}

const compProps = reactive({
  beforeChange: undefined,
  disabled: false,
  gap: 0,
  showIcon: true,
  size: 'middle',
  allowClear: false,
} as Recordable<any>);

const [Form] = useVbenForm({
  handleValuesChange(values) {
    Object.keys(values).forEach((k) => {
      if (k === 'beforeChange') {
        compProps[k] = values[k] ? beforeChange : undefined;
      } else {
        compProps[k] = values[k];
      }
    });
  },
  commonConfig: {
    labelWidth: 150,
  },
  schema: [
    {
      component: 'RadioGroup',
      componentProps: {
        options: [
          { label: 'Lớn', value: 'large' },
          { label: 'Vừa', value: 'middle' },
          { label: 'Nhỏ', value: 'small' },
        ],
      },
      defaultValue: compProps.size,
      fieldName: 'size',
      label: 'Kích thước',
    },
    {
      component: 'RadioGroup',
      componentProps: {
        options: [
          { label: 'Không có', value: 0 },
          { label: 'Nhỏ', value: 5 },
          { label: 'Vừa', value: 15 },
          { label: 'Lớn', value: 30 },
        ],
      },
      defaultValue: compProps.gap,
      fieldName: 'gap',
      label: 'Khoảng cách',
    },
    {
      component: 'Switch',
      defaultValue: compProps.showIcon,
      fieldName: 'showIcon',
      label: 'Hiển thị biểu tượng',
    },
    {
      component: 'Switch',
      defaultValue: compProps.disabled,
      fieldName: 'disabled',
      label: 'Vô hiệu hóa',
    },
    {
      component: 'Switch',
      defaultValue: false,
      fieldName: 'beforeChange',
      label: 'Callback trước',
    },
    {
      component: 'Switch',
      defaultValue: false,
      fieldName: 'allowClear',
      label: 'Cho phép xóa',
      help: 'Khi chọn một, có cho phép hủy chọn hay không (giá trị là undefined)',
    },
    {
      component: 'InputNumber',
      defaultValue: 0,
      fieldName: 'maxCount',
      label: 'Số lượng chọn tối đa',
      help: 'Có hiệu lực khi chọn nhiều, 0 nghĩa là không giới hạn',
    },
  ],
  showDefaultActions: false,
  submitOnChange: true,
});

function onBtnClick(value: any) {
  const opt = options.find((o) => o.value === value);
  if (opt) {
    message.success(`Đã nhấn nút ${opt.label}, value = ${value}`);
  }
}
</script>
<template>
  <Page
    title="VbenButtonGroup Nhóm nút"
    description="VbenButtonGroup là một vùng chứa nút, dùng để bao một nhóm nút và điều phối kiểu tổng thể. VbenCheckButtonGroup thì có thể dùng làm component form, cung cấp chức năng chọn một hoặc chọn nhiều"
  >
    <Card title="Cách dùng cơ bản">
      <template #extra>
        <Button type="primary" @click="resetValues">Xóa giá trị</Button>
      </template>
      <p class="mt-4">Nhóm nút:</p>
      <div class="mt-2 flex flex-col gap-2">
        <VbenButtonGroup v-bind="compProps" border>
          <VbenButton
            v-for="btn in options"
            :key="btn.value"
            variant="link"
            @click="onBtnClick(btn.value)"
          >
            {{ btn.label }}
          </VbenButton>
        </VbenButtonGroup>
        <VbenButtonGroup v-bind="compProps" border>
          <VbenButton
            v-for="btn in options"
            :key="btn.value"
            variant="outline"
            @click="onBtnClick(btn.value)"
          >
            {{ btn.label }}
          </VbenButton>
        </VbenButtonGroup>
      </div>
      <p class="mt-4">Chọn một:{{ radioValue }}</p>
      <div class="mt-2 flex flex-col gap-2">
        <VbenCheckButtonGroup
          v-model="radioValue"
          :options="options"
          v-bind="compProps"
        />
      </div>
      <p class="mt-4">Slot chọn một:{{ radioValue }}</p>
      <div class="mt-2 flex flex-col gap-2">
        <VbenCheckButtonGroup
          v-model="radioValue"
          :options="options"
          v-bind="compProps"
        >
          <template #option="{ label, value, data }">
            <div class="flex items-center">
              <span>{{ label }}</span>
              <span class="ml-2 text-gray-400">{{ value }}</span>
              <span v-if="data.num" class="white ml-2">{{ data.num }}</span>
            </div>
          </template>
        </VbenCheckButtonGroup>
      </div>
      <p class="mt-4">Chọn nhiều{{ checkValue }}</p>
      <div class="mt-2 flex flex-col gap-2">
        <VbenCheckButtonGroup
          v-model="checkValue"
          multiple
          :options="options"
          v-bind="compProps"
        />
      </div>
      <p class="mt-4">Biểu tượng tùy chỉnh{{ checkValue }}</p>
      <div class="mt-2 flex flex-col gap-2">
        <VbenCheckButtonGroup
          v-model="checkValue"
          multiple
          :options="options"
          v-bind="compProps"
        >
          <template #icon="{ loading, checked }">
            <LoaderCircle class="animate-spin" v-if="loading" />
            <SquareCheckBig v-else-if="checked" />
            <Square v-else />
          </template>
        </VbenCheckButtonGroup>
      </div>
    </Card>

    <Card title="Cài đặt" class="mt-4">
      <Form />
    </Card>
  </Page>
</template>
