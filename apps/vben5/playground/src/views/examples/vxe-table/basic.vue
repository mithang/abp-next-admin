<script lang="ts" setup>
import type { VxeGridListeners, VxeGridProps } from '#/adapter/vxe-table';

import { Page } from '@vben/common-ui';

import { Button, message } from 'ant-design-vue';

import { useVbenVxeGrid } from '#/adapter/vxe-table';

import DocButton from '../doc-button.vue';
import { MOCK_TABLE_DATA } from './table-data';

interface RowType {
  address: string;
  age: number;
  id: number;
  name: string;
  nickname: string;
  role: string;
}

const gridOptions: VxeGridProps<RowType> = {
  columns: [
    { title: 'STT', type: 'seq', width: 50 },
    { field: 'name', title: 'Name' },
    { field: 'age', sortable: true, title: 'Age' },
    { field: 'nickname', title: 'Nickname' },
    { field: 'role', title: 'Role' },
    { field: 'address', showOverflow: true, title: 'Address' },
  ],
  data: MOCK_TABLE_DATA,
  pagerConfig: {
    enabled: false,
  },
  sortConfig: {
    multiple: true,
  },
};

const gridEvents: VxeGridListeners<RowType> = {
  cellClick: ({ row }) => {
    message.info(`cell-click: ${row.name}`);
  },
};

// @ts-ignore
const [Grid, gridApi] = useVbenVxeGrid<RowType>({
  // Bỏ ghi chú để xem kiểu của component form
  // formOptions: {
  //   schema: [
  //     {
  //       component: 'Switch',
  //       fieldName: 'name',
  //     },
  //   ],
  // },
  gridEvents,
  gridOptions,
});

// Bỏ ghi chú để xem kiểu của instance bảng hiện tại
// gridApi.grid

const showBorder = gridApi.useStore((state) => state.gridOptions?.border);
const showStripe = gridApi.useStore((state) => state.gridOptions?.stripe);

function changeBorder() {
  gridApi.setGridOptions({
    border: !showBorder.value,
  });
}

function changeStripe() {
  gridApi.setGridOptions({
    stripe: !showStripe.value,
  });
}

function changeLoading() {
  gridApi.setLoading(true);
  setTimeout(() => {
    gridApi.setLoading(false);
  }, 2000);
}
</script>

<template>
  <Page
    description="Component bảng thường dùng để phát triển nhanh giao diện hiển thị và tương tác dữ liệu, dữ liệu ví dụ là dữ liệu tĩnh. Component này là bản đóng gói lại đơn giản của vxe-table, phần lớn thuộc tính và phương thức giữ nguyên như vxe-table."
    title="Ví dụ bảng cơ bản"
  >
    <template #extra>
      <DocButton path="/components/common-ui/vben-vxe-table" />
    </template>
    <Grid table-title="Danh sách cơ bản" table-title-help="Gợi ý">
      <!-- <template #toolbar-actions>
        <Button class="mr-2" type="primary">Slot bên trái</Button>
      </template> -->
      <template #toolbar-tools>
        <Button class="mr-2" type="primary" @click="changeBorder">
          {{ showBorder ? 'Ẩn' : 'Hiện' }}viền
        </Button>
        <Button class="mr-2" type="primary" @click="changeLoading">
          Hiển thị loading
        </Button>
        <Button type="primary" @click="changeStripe">
          {{ showStripe ? 'Ẩn' : 'Hiện' }}sọc vằn
        </Button>
      </template>
    </Grid>
  </Page>
</template>
