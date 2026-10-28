<script lang="ts" setup>
import { ref } from 'vue';

import { Page } from '@vben/common-ui';

import { Button, Card, message, Step, Steps, Switch } from 'ant-design-vue';

import { useVbenForm } from '#/adapter/form';

const currentTab = ref(0);
function onFirstSubmit(values: Record<string, any>) {
  message.success({
    content: `form1 values: ${JSON.stringify(values)}`,
  });
  currentTab.value = 1;
}
function onSecondReset() {
  currentTab.value = 0;
}
function onSecondSubmit(values: Record<string, any>) {
  message.success({
    content: `form2 values: ${JSON.stringify(values)}`,
  });
}

const [FirstForm, firstFormApi] = useVbenForm({
  commonConfig: {
    componentProps: {
      class: 'w-full',
    },
  },
  handleSubmit: onFirstSubmit,
  layout: 'horizontal',
  resetButtonOptions: {
    show: false,
  },
  schema: [
    {
      component: 'Input',
      componentProps: {
        placeholder: 'Vui lòng nhập',
      },
      fieldName: 'formFirst',
      label: 'Trường form 1',
      rules: 'required',
    },
  ],
  submitButtonOptions: {
    content: 'Bước tiếp theo',
  },
  wrapperClass: 'grid-cols-1 md:grid-cols-1 lg:grid-cols-1',
});
const [SecondForm, secondFormApi] = useVbenForm({
  commonConfig: {
    componentProps: {
      class: 'w-full',
    },
  },
  handleReset: onSecondReset,
  handleSubmit: onSecondSubmit,
  layout: 'horizontal',
  resetButtonOptions: {
    content: 'Bước trước',
  },
  schema: [
    {
      component: 'Input',
      componentProps: {
        placeholder: 'Vui lòng nhập',
      },
      fieldName: 'formSecond',
      label: 'Trường form 2',
      rules: 'required',
    },
  ],
  wrapperClass: 'grid-cols-1 md:grid-cols-1 lg:grid-cols-1',
});
const needMerge = ref(true);
async function handleMergeSubmit() {
  const values = await firstFormApi
    .merge(secondFormApi)
    .submitAllForm(needMerge.value);
  message.success({
    content: `merged form values: ${JSON.stringify(values)}`,
  });
}
</script>

<template>
  <Page
    description="Ví dụ gộp component form: Trong một số trường hợp, ví dụ form nhiều bước, cần gộp nhiều form và gửi chung. Theo mặc định, dùng quy tắc Object.assign để gộp form. Nếu cần xử lý dữ liệu đặc biệt, có thể truyền false."
    title="Component form"
  >
    <Card title="Ví dụ cơ bản">
      <template #extra>
        <Switch
          v-model="needMerge"
          checked-children="Bật gộp trường"
          class="mr-4"
          un-checked-children="Tắt gộp trường"
        />
        <Button type="primary" @click="handleMergeSubmit">
          Gửi sau khi gộp
        </Button>
      </template>
      <div class="mx-auto max-w-lg">
        <Steps :current="currentTab" class="steps">
          <Step title="Form 1" />
          <Step title="Form 2" />
        </Steps>
        <div class="p-20">
          <FirstForm v-show="currentTab === 0" />
          <SecondForm v-show="currentTab === 1" />
        </div>
      </div>
    </Card>
  </Page>
</template>
