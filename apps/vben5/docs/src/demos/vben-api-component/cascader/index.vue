<script lang="ts" setup>
import { ApiComponent } from '@vben/common-ui';

import { Cascader } from 'ant-design-vue';

const treeData: Record<string, any> = [
  {
    label: 'Chiết Giang',
    value: 'zhejiang',
    children: [
      {
        value: 'hangzhou',
        label: 'Hàng Châu',
        children: [
          {
            value: 'xihu',
            label: 'Tây Hồ',
          },
          {
            value: 'sudi',
            label: 'Tô Đê',
          },
        ],
      },
      {
        value: 'jiaxing',
        label: 'Gia Hưng',
        children: [
          {
            value: 'wuzhen',
            label: 'Ô Trấn',
          },
          {
            value: 'meihuazhou',
            label: 'Mai Hoa Châu',
          },
        ],
      },
      {
        value: 'zhoushan',
        label: 'Chu Sơn',
        children: [
          {
            value: 'putuoshan',
            label: 'Phổ Đà Sơn',
          },
          {
            value: 'taohuadao',
            label: 'Đào Hoa Đảo',
          },
        ],
      },
    ],
  },
  {
    label: 'Giang Tô',
    value: 'jiangsu',
    children: [
      {
        value: 'nanjing',
        label: 'Nam Kinh',
        children: [
          {
            value: 'zhonghuamen',
            label: 'Trung Hoa Môn',
          },
          {
            value: 'zijinshan',
            label: 'Tử Kim Sơn',
          },
          {
            value: 'yuhuatai',
            label: 'Vũ Hoa Đài',
          },
        ],
      },
    ],
  },
];
/**
 * Mô phỏng giao diện yêu cầu
 */
function fetchApi(): Promise<Record<string, any>> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(treeData);
    }, 1000);
  });
}
</script>
<template>
  <ApiComponent
    :api="fetchApi"
    :component="Cascader"
    :immediate="false"
    children-field="children"
    loading-slot="suffixIcon"
    visible-event="onDropdownVisibleChange"
  />
</template>
