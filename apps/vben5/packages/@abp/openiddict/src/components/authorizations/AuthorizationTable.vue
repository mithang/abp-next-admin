<script setup lang="ts">
import type { VxeGridListeners, VxeGridProps } from '@abp/ui';
import type { SelectValue } from 'ant-design-vue/es/select';

import type { VbenFormProps } from '@vben/common-ui';

import type { OpenIddictApplicationDto } from '../../types';
import type { OpenIddictAuthorizationDto } from '../../types/authorizations';

import { defineAsyncComponent, h, onMounted, ref } from 'vue';

import { useAccess } from '@vben/access';
import { useVbenModal } from '@vben/common-ui';
import { $t } from '@vben/locales';

import { formatToDateTime } from '@abp/core';
import { useVbenVxeGrid } from '@abp/ui';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons-vue';
import { Button, message, Modal, Select } from 'ant-design-vue';
import debounce from 'lodash.debounce';

import { useApplicationsApi } from '../../api/useApplicationsApi';
import { useAuthorizationsApi } from '../../api/useAuthorizationsApi';
import { AuthorizationsPermissions } from '../../constants/permissions';

defineOptions({
  name: 'AuthorizationTable',
});

const { hasAccessByCodes } = useAccess();
const { getPagedListApi: getApplications } = useApplicationsApi();
const { deleteApi, getPagedListApi } = useAuthorizationsApi();

const applications = ref<OpenIddictApplicationDto[]>([]);
const formOptions: VbenFormProps = {
  // Mở rộng mặc định
  collapsed: true,
  collapsedRows: 2,
  // Dùng chung cho mọi mục form, có thể ghi đè riêng trong từng form
  commonConfig: {
    // Hiển thị một dấu hai chấm sau label
    colon: true,
    // Tất cả các mục form
    componentProps: {
      class: 'w-full',
    },
  },
  fieldMappingTime: [
    ['creationTime', ['beginCreationTime', 'endCreationTime'], 'YYYY-MM-DD'],
  ],
  handleReset: onFormReset,
  schema: [
    {
      component: 'Select',
      fieldName: 'clientId',
      formItemClass: 'col-span-1/3 items-baseline',
      label: $t('AbpOpenIddict.DisplayName:ClientId'),
    },
    {
      component: 'RangePicker',
      fieldName: 'creationTime',
      formItemClass: 'col-span-2 items-baseline',
      label: $t('AbpOpenIddict.DisplayName:CreationTime'),
    },
    {
      component: 'Input',
      fieldName: 'subject',
      formItemClass: 'col-span-1/3 items-baseline',
      label: $t('AbpOpenIddict.DisplayName:Subject'),
    },
    {
      component: 'Input',
      fieldName: 'status',
      formItemClass: 'col-span-1/3 items-baseline',
      label: $t('AbpOpenIddict.DisplayName:Status'),
    },
    {
      component: 'Input',
      fieldName: 'type',
      formItemClass: 'col-span-1/3 items-baseline',
      label: $t('AbpOpenIddict.DisplayName:Type'),
    },
    {
      component: 'Input',
      fieldName: 'filter',
      formItemClass: 'col-span-2 items-baseline',
      label: $t('AbpUi.Search'),
    },
  ],
  // Điều khiển form có hiển thị nút thu gọn hay không
  showCollapseButton: true,
  // Có gửi form khi nhấn Enter hay không
  submitOnEnter: true,
};

const gridOptions: VxeGridProps<OpenIddictAuthorizationDto> = {
  columns: [
    {
      align: 'left',
      field: 'applicationId',
      minWidth: 300,
      sortable: true,
      title: $t('AbpOpenIddict.DisplayName:ApplicationId'),
    },
    {
      align: 'left',
      field: 'subject',
      minWidth: 300,
      sortable: true,
      title: $t('AbpOpenIddict.DisplayName:Subject'),
    },
    {
      align: 'left',
      field: 'type',
      minWidth: 150,
      sortable: true,
      title: $t('AbpOpenIddict.DisplayName:Type'),
    },
    {
      align: 'left',
      field: 'status',
      minWidth: 150,
      sortable: true,
      title: $t('AbpOpenIddict.DisplayName:Status'),
    },
    {
      align: 'left',
      field: 'creationDate',
      formatter: ({ cellValue }) => {
        return cellValue ? formatToDateTime(cellValue) : cellValue;
      },
      minWidth: 200,
      sortable: true,
      title: $t('AbpOpenIddict.DisplayName:CreationDate'),
    },
    {
      field: 'action',
      fixed: 'right',
      slots: { default: 'action' },
      title: $t('AbpUi.Actions'),
      visible: hasAccessByCodes([AuthorizationsPermissions.Delete]),
      width: 220,
    },
  ],
  exportConfig: {},
  keepSource: true,
  proxyConfig: {
    ajax: {
      query: async ({ page, sort }, formValues) => {
        const sorting = sort.order ? `${sort.field} ${sort.order}` : undefined;
        return await getPagedListApi({
          sorting,
          maxResultCount: page.pageSize,
          skipCount: (page.currentPage - 1) * page.pageSize,
          ...formValues,
        });
      },
    },
    response: {
      total: 'totalCount',
      list: 'items',
    },
  },
  toolbarConfig: {
    custom: true,
    export: true,
    refresh: true,
    refreshOptions: {
      code: 'query',
    },
    zoom: true,
  },
};
const gridEvents: VxeGridListeners<OpenIddictAuthorizationDto> = {
  sortChange: () => {
    gridApi.query();
  },
};
const [AuthorizationModal, modalApi] = useVbenModal({
  connectedComponent: defineAsyncComponent(
    () => import('./AuthorizationModal.vue'),
  ),
});

const [Grid, gridApi] = useVbenVxeGrid({
  formOptions,
  gridOptions,
  gridEvents,
});

const onSearchClient = debounce(async (filter?: string) => {
  const { items } = await getApplications({
    filter,
    maxResultCount: 25,
  });
  applications.value = items;
}, 500);

function onChangeClient(value?: SelectValue) {
  gridApi.formApi.setFieldValue('clientId', value);
}

function onUpdate(row: OpenIddictAuthorizationDto) {
  modalApi.setData(row);
  modalApi.open();
}

function onDelete(row: OpenIddictAuthorizationDto) {
  Modal.confirm({
    centered: true,
    content: `${$t('AbpUi.ItemWillBeDeletedMessage')}`,
    onOk: async () => {
      await deleteApi(row.id);
      message.success($t('AbpUi.DeletedSuccessfully'));
      gridApi.query();
    },
    title: $t('AbpUi.AreYouSure'),
  });
}

function onFormReset() {
  gridApi.formApi.resetForm();
  gridApi.formApi.submitForm();
}
onMounted(onSearchClient);
</script>

<template>
  <Grid :table-title="$t('AbpOpenIddict.Authorizations')">
    <template #form-clientId="{ modelValue }">
      <Select
        :default-active-first-option="false"
        :field-names="{ label: 'clientId', value: 'id' }"
        :filter-option="false"
        :options="applications"
        :placeholder="$t('ui.placeholder.select')"
        :value="modelValue"
        allow-clear
        class="w-full"
        show-search
        @change="onChangeClient"
        @search="onSearchClient"
      />
    </template>
    <template #action="{ row }">
      <div class="flex flex-row">
        <div class="basis-1/2">
          <Button
            :icon="h(EditOutlined)"
            block
            type="link"
            @click="onUpdate(row)"
          >
            {{ $t('AbpUi.Edit') }}
          </Button>
        </div>
        <div class="basis-1/2">
          <Button
            :icon="h(DeleteOutlined)"
            block
            danger
            type="link"
            v-access:code="[AuthorizationsPermissions.Delete]"
            @click="onDelete(row)"
          >
            {{ $t('AbpUi.Delete') }}
          </Button>
        </div>
      </div>
    </template>
  </Grid>
  <AuthorizationModal @change="() => gridApi.query()" />
</template>

<style lang="scss" scoped></style>
