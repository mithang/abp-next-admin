<script lang="ts" setup>
import type { TippyProps } from '@vben/common-ui';

import { reactive } from 'vue';

import { Page, Tippy } from '@vben/common-ui';

import { Button, Card, Flex } from 'ant-design-vue';

import { useVbenForm } from '#/adapter/form';

const tippyProps = reactive<TippyProps>({
  animation: 'shift-away',
  arrow: true,
  content: 'Đây là một gợi ý',
  delay: [200, 200],
  duration: 200,
  followCursor: false,
  hideOnClick: false,
  inertia: true,
  maxWidth: 'none',
  placement: 'top',
  theme: 'dark',
  trigger: 'mouseenter focusin',
});

function parseBoolean(value: string) {
  switch (value) {
    case 'false': {
      return false;
    }
    case 'true': {
      return true;
    }
    default: {
      return value;
    }
  }
}

const [Form] = useVbenForm({
  handleValuesChange(values) {
    Object.assign(tippyProps, {
      ...values,
      delay: [values.delay1, values.delay2],
      followCursor: parseBoolean(values.followCursor),
      hideOnClick: parseBoolean(values.hideOnClick),
      trigger: values.trigger.join(' '),
    });
  },
  schema: [
    {
      component: 'RadioGroup',
      componentProps: {
        buttonStyle: 'solid',
        class: 'w-full',
        options: [
          { label: 'Tự động', value: 'auto' },
          { label: 'Tối', value: 'dark' },
          { label: 'Sáng', value: 'light' },
        ],
        optionType: 'button',
      },
      defaultValue: tippyProps.theme,
      fieldName: 'theme',
      label: 'Chủ đề',
    },
    {
      component: 'Select',
      componentProps: {
        class: 'w-full',
        options: [
          { label: 'Trượt lên', value: 'shift-away' },
          { label: 'Trượt xuống', value: 'shift-toward' },
          { label: 'Thu phóng', value: 'scale' },
          { label: 'Phối cảnh', value: 'perspective' },
          { label: 'Mờ dần', value: 'fade' },
        ],
      },
      defaultValue: tippyProps.animation,
      fieldName: 'animation',
      label: 'Loại hiệu ứng',
    },
    {
      component: 'RadioGroup',
      componentProps: {
        buttonStyle: 'solid',
        options: [
          { label: 'Có', value: true },
          { label: 'Không', value: false },
        ],
        optionType: 'button',
      },
      defaultValue: tippyProps.inertia,
      fieldName: 'inertia',
      label: 'Quán tính hiệu ứng',
    },
    {
      component: 'Select',
      componentProps: {
        class: 'w-full',
        options: [
          { label: 'Trên', value: 'top' },
          { label: 'Trên-trái', value: 'top-start' },
          { label: 'Trên-phải', value: 'top-end' },
          { label: 'Dưới', value: 'bottom' },
          { label: 'Dưới-trái', value: 'bottom-start' },
          { label: 'Dưới-phải', value: 'bottom-end' },
          { label: 'Trái', value: 'left' },
          { label: 'Trái-trên', value: 'left-start' },
          { label: 'Trái-dưới', value: 'left-end' },
          { label: 'Phải', value: 'right' },
          { label: 'Phải-trên', value: 'right-start' },
          { label: 'Phải-dưới', value: 'right-end' },
        ],
      },
      defaultValue: tippyProps.placement,
      fieldName: 'placement',
      label: 'Vị trí',
    },
    {
      component: 'InputNumber',
      componentProps: {
        addonAfter: 'mili giây',
      },
      defaultValue: tippyProps.duration,
      fieldName: 'duration',
      label: 'Thời lượng hiệu ứng',
    },
    {
      component: 'InputNumber',
      componentProps: {
        addonAfter: 'mili giây',
      },
      defaultValue: 100,
      fieldName: 'delay1',
      label: 'Độ trễ hiển thị',
    },
    {
      component: 'InputNumber',
      componentProps: {
        addonAfter: 'mili giây',
      },
      defaultValue: 100,
      fieldName: 'delay2',
      label: 'Độ trễ ẩn',
    },
    {
      component: 'Input',
      defaultValue: tippyProps.content,
      fieldName: 'content',
      label: 'Nội dung',
    },
    {
      component: 'RadioGroup',
      componentProps: {
        buttonStyle: 'solid',
        options: [
          { label: 'Có', value: true },
          { label: 'Không', value: false },
        ],
        optionType: 'button',
      },
      defaultValue: tippyProps.arrow,
      fieldName: 'arrow',
      label: 'Mũi tên chỉ hướng',
    },
    {
      component: 'Select',
      componentProps: {
        class: 'w-full',
        options: [
          { label: 'Không theo', value: 'false' },
          { label: 'Theo hoàn toàn', value: 'true' },
          { label: 'Chỉ ngang', value: 'horizontal' },
          { label: 'Chỉ dọc', value: 'vertical' },
          { label: 'Chỉ ban đầu', value: 'initial' },
        ],
      },
      defaultValue: tippyProps.followCursor?.toString(),
      fieldName: 'followCursor',
      label: 'Theo con trỏ',
    },
    {
      component: 'Select',
      componentProps: {
        class: 'w-full',
        mode: 'multiple',
        options: [
          { label: 'Di chuột vào', value: 'mouseenter' },
          { label: 'Được nhấp', value: 'click' },
          { label: 'Được focus', value: 'focusin' },
          { label: 'Không kích hoạt, chỉ thủ công', value: 'manual' },
        ],
      },
      defaultValue: tippyProps.trigger?.split(' '),
      fieldName: 'trigger',
      label: 'Cách kích hoạt',
    },
    {
      component: 'Select',
      componentProps: {
        class: 'w-full',
        options: [
          { label: 'Không', value: 'false' },
          { label: 'Có', value: 'true' },
          { label: 'Chỉ nội bộ', value: 'toggle' },
        ],
      },
      defaultValue: tippyProps.hideOnClick?.toString(),
      dependencies: {
        componentProps(_, formAction) {
          return {
            disabled: !formAction.values.trigger.includes('click'),
          };
        },
        triggerFields: ['trigger'],
      },
      fieldName: 'hideOnClick',
      help: 'Chỉ có hiệu lực khi cách kích hoạt là `click`',
      label: 'Ẩn sau khi nhấp',
    },
    {
      component: 'Input',
      componentProps: {
        allowClear: true,
        placeholder: 'none、200px',
      },
      defaultValue: tippyProps.maxWidth,
      fieldName: 'maxWidth',
      label: 'Chiều rộng tối đa',
    },
  ],
  showDefaultActions: false,
  wrapperClass: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
});

function goDoc() {
  window.open('https://atomiks.github.io/tippyjs/v6/all-props/');
}
</script>
<template>
  <Page title="Tippy">
    <template #description>
      <div class="flex items-center">
        <p>
          Tippy là một thư viện gợi ý nhẹ, có thể dùng để tạo nhiều loại gợi ý
          tương tác như tooltip, gợi ý hướng dẫn, v.v.
        </p>
        <Button type="link" size="small" @click="goDoc">Xem tài liệu</Button>
      </div>
    </template>
    <Card title="Dùng dạng directive">
      <p class="mb-4">
        Dùng dạng directive khá gọn, truyền cấu hình trực tiếp bằng v-tippy trên
        component cần hiển thị tooltip, phù hợp với tooltip có nội dung cố định.
      </p>
      <Flex warp="warp" gap="20" align="center">
        <Button v-tippy="'Đây là một gợi ý, dùng cấu hình mặc định'">
          Cấu hình mặc định
        </Button>

        <Button
          v-tippy="{
            theme: 'light',
            content: 'Đây là một gợi ý, luôn dùng chủ đề light',
          }"
        >
          Chỉ định chủ đề
        </Button>
        <Button
          v-tippy="{
            theme: 'light',
            content:
              'Gợi ý này sẽ kích hoạt 100 mili giây sau khi nhấn vào component',
            delay: 100,
          }"
        >
          Chỉ định độ trễ
        </Button>
        <Button
          v-tippy="{
            content: 'Hiệu ứng của gợi ý này là `scale`',
            animation: 'scale',
          }"
        >
          Chỉ định hiệu ứng
        </Button>
      </Flex>
    </Card>
    <Card title="Dùng dạng component" class="mt-4">
      <div class="flex w-full justify-center">
        <Tippy v-bind="tippyProps">
          <Button>Di chuột lên component này để trải nghiệm hiệu ứng</Button>
        </Tippy>
      </div>

      <Form class="mt-4" />
      <template #actions>
        <p
          class="cursor-default text-secondary-foreground hover:text-secondary-foreground"
        >
          Để có thêm cấu hình, vui lòng
          <Button type="link" size="small" @click="goDoc">Xem tài liệu</Button>
          , ở đây chỉ liệt kê một số cấu hình thường dùng
        </p>
      </template>
    </Card>
  </Page>
</template>
