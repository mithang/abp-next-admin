<script lang="ts" setup>
import { reactive } from 'vue';
import { useRoute } from 'vue-router';

import { Page } from '@vben/common-ui';
import { useAccessStore } from '@vben/stores';

import { MenuBadge } from '@vben-core/menu-ui';

import { Button, Card, Radio, RadioGroup } from 'ant-design-vue';

import { useVbenForm } from '#/adapter/form';

const colors = [
  { label: 'Preset: Mặc định', value: 'default' },
  { label: 'Preset: Quan trọng', value: 'destructive' },
  { label: 'Preset: Chính', value: 'primary' },
  { label: 'Preset: Thành công', value: 'success' },
  { label: 'Tùy chỉnh', value: 'bg-gray-200 text-black' },
];

const route = useRoute();
const accessStore = useAccessStore();
const menu = accessStore.getMenuByPath(route.path);
const badgeProps = reactive({
  badge: menu?.badge as string,
  badgeType: menu?.badge ? 'normal' : (menu?.badgeType as 'dot' | 'normal'),
  badgeVariants: menu?.badgeVariants as string,
});

const [Form] = useVbenForm({
  handleValuesChange(values) {
    badgeProps.badge = values.badge;
    badgeProps.badgeType = values.badgeType;
    badgeProps.badgeVariants = values.badgeVariants;
  },
  schema: [
    {
      component: 'RadioGroup',
      componentProps: {
        buttonStyle: 'solid',
        options: [
          { label: 'Huy hiệu chấm', value: 'dot' },
          { label: 'Huy hiệu chữ', value: 'normal' },
        ],
        optionType: 'button',
      },
      defaultValue: badgeProps.badgeType,
      fieldName: 'badgeType',
      label: 'Loại',
    },
    {
      component: 'Input',
      componentProps: {
        maxLength: 4,
        placeholder: 'Vui lòng nhập nội dung huy hiệu',
        style: { width: '200px' },
      },
      defaultValue: badgeProps.badge,
      fieldName: 'badge',
      label: 'Nội dung huy hiệu',
    },
    {
      component: 'RadioGroup',
      defaultValue: badgeProps.badgeVariants,
      fieldName: 'badgeVariants',
      label: 'Màu sắc',
    },
    {
      component: 'Input',
      fieldName: 'action',
    },
  ],
  showDefaultActions: false,
});

function updateMenuBadge() {
  if (menu) {
    menu.badge = badgeProps.badge;
    menu.badgeType = badgeProps.badgeType;
    menu.badgeVariants = badgeProps.badgeVariants;
  }
}
</script>

<template>
  <Page
    description="Các mục menu có thể hiển thị huy hiệu，các huy hiệu này có thể cập nhật chủ động"
    title="Huy hiệu menu"
  >
    <Card title="Cập nhật huy hiệu">
      <Form>
        <template #badgeVariants="slotProps">
          <RadioGroup v-bind="slotProps">
            <Radio
              v-for="color in colors"
              :key="color.value"
              :value="color.value"
            >
              <div
                :title="color.label"
                class="flex h-[14px] w-[50px] items-center justify-start"
              >
                <MenuBadge
                  v-bind="{ ...badgeProps, badgeVariants: color.value }"
                />
              </div>
            </Radio>
          </RadioGroup>
        </template>
        <template #action>
          <Button type="primary" @click="updateMenuBadge">
            Cập nhật huy hiệu
          </Button>
        </template>
      </Form>
    </Card>
  </Page>
</template>
