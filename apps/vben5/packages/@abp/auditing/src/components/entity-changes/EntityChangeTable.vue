<script setup lang="ts">
import type { VxeGridDefines, VxeGridPropTypes } from 'vxe-table';

import type {
  EntityChangeDto,
  PropertyChange,
} from '../../types/entity-changes';

import { computed, reactive, watchEffect } from 'vue';

import { $t } from '@vben/locales';

import { formatToDateTime } from '@abp/core';
import { Tag } from 'ant-design-vue';
import { VxeGrid } from 'vxe-table';

import { useAuditlogs } from '../../hooks/useAuditlogs';

defineOptions({
  name: 'EntityChangeTable',
});

const props = defineProps<{
  data: EntityChangeDto[];
  showUserName?: boolean;
}>();

const { getChangeTypeColor, getChangeTypeValue } = useAuditlogs();

/** Cấu hình phân trang bảng thay đổi thực thể */
const pagerConfig = reactive<VxeGridPropTypes.PagerConfig>({
  currentPage: 1,
  pageSize: 10,
  pageSizes: [10, 25, 50, 100],
  total: 0,
});
/** Cấu hình cột dữ liệu bảng thay đổi thực thể */
const columnsConfig = reactive<VxeGridPropTypes.Columns<EntityChangeDto>>([
  {
    align: 'left',
    field: 'propertyChanges',
    slots: {
      content: 'changes',
    },
    type: 'expand',
  },
  {
    align: 'left',
    field: 'userName',
    title: $t('AbpAuditLogging.UserName'),
    visible: props.showUserName,
    width: 100,
  },
  {
    align: 'center',
    field: 'changeType',
    slots: { default: 'type' },
    sortable: true,
    title: $t('AbpAuditLogging.ChangeType'),
    width: 100,
  },
  {
    align: 'left',
    field: 'changeTime',
    formatter: ({ cellValue }) => {
      return cellValue ? formatToDateTime(cellValue) : cellValue;
    },
    sortable: true,
    title: $t('AbpAuditLogging.StartTime'),
    width: 200,
  },
  {
    align: 'left',
    field: 'entityTypeFullName',
    sortable: true,
    title: $t('AbpAuditLogging.EntityTypeFullName'),
    width: 'auto',
  },
  {
    align: 'left',
    field: 'entityId',
    sortable: true,
    title: $t('AbpAuditLogging.EntityId'),
    width: 280,
  },
  {
    align: 'left',
    field: 'entityTenantId',
    sortable: true,
    title: $t('AbpAuditLogging.TenantId'),
    width: 280,
  },
]);
/** Cấu hình cột dữ liệu bảng thay đổi thuộc tính */
const subColumnsConfig = reactive<VxeGridPropTypes.Columns<PropertyChange>>([
  {
    align: 'left',
    field: 'propertyName',
    sortable: true,
    title: $t('AbpAuditLogging.PropertyName'),
    width: 120,
  },
  {
    align: 'left',
    className: 'font-medium text-green-600',
    field: 'newValue',
    sortable: true,
    title: $t('AbpAuditLogging.NewValue'),
    width: 200,
  },
  {
    align: 'left',
    className: 'font-medium text-red-600',
    field: 'originalValue',
    sortable: true,
    title: $t('AbpAuditLogging.OriginalValue'),
    width: 200,
  },
  {
    align: 'left',
    field: 'propertyTypeFullName',
    sortable: true,
    title: $t('AbpAuditLogging.PropertyTypeFullName'),
    width: 220,
  },
]);
/** Nguồn dữ liệu bảng thay đổi thực thể (tính phân trang) */
const getEntityChanges = computed(() => {
  const entityChanges = props.data ?? [];
  const current = pagerConfig.currentPage ?? 1;
  const pageSize = pagerConfig.pageSize ?? 10;
  return entityChanges.slice((current - 1) * pageSize, pageSize * current);
});
/** Sự kiện thay đổi số trang */
function onPageChange(
  params: VxeGridDefines.PageChangeEventParams<EntityChangeDto>,
) {
  pagerConfig.currentPage = params.currentPage;
  pagerConfig.pageSize = params.pageSize;
}
watchEffect(() => {
  pagerConfig.total = props.data.length;
});
</script>

<template>
  <VxeGrid
    :columns="columnsConfig"
    :data="getEntityChanges"
    :expand-config="{
      padding: true,
    }"
    :pager-config="pagerConfig"
    @page-change="onPageChange"
  >
    <template #type="{ row }">
      <Tag :color="getChangeTypeColor(row.changeType)">
        {{ getChangeTypeValue(row.changeType) }}
      </Tag>
    </template>
    <template #changes="{ row }">
      <VxeGrid
        :border="true"
        :columns="subColumnsConfig"
        :data="row.propertyChanges"
      />
    </template>
  </VxeGrid>
</template>

<style scoped></style>
