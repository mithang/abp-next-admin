<script setup lang="ts">
import type { SecurityLogDto } from '../../types/security-logs';

import { ref } from 'vue';

import { useVbenDrawer } from '@vben/common-ui';
import { $t } from '@vben/locales';

import { formatToDateTime } from '@abp/core';
import { Descriptions } from 'ant-design-vue';

import { useSecurityLogsApi } from '../../api/useSecurityLogsApi';

defineOptions({
  name: 'SecurityLogDrawer',
});

const DescriptionsItem = Descriptions.Item;

const formModel = ref<SecurityLogDto>({} as SecurityLogDto);

const { cancel, getApi } = useSecurityLogsApi();

const [Drawer, drawerApi] = useVbenDrawer({
  class: 'w-auto',
  onBeforeClose() {
    cancel('Security log drawer has closed!');
    // Trả về true để cho phép đóng (undefined cũng cho phép đóng theo
    // drawer-api, nhưng kiểu onBeforeClose yêu cầu boolean | undefined rõ ràng).
    return true;
  },
  onCancel() {
    drawerApi.close();
  },
  onConfirm: async () => {},
  onOpenChange: async (isOpen: boolean) => {
    formModel.value = {} as SecurityLogDto;
    if (isOpen) {
      try {
        drawerApi.setState({ loading: true });
        const dto = drawerApi.getData<SecurityLogDto>();
        await onGet(dto.id);
      } finally {
        drawerApi.setState({ loading: false });
      }
    }
  },
  title: $t('AbpAuditLogging.SecurityLog'),
});
/** Truy vấn nhật ký kiểm toán */
async function onGet(id: string) {
  const dto = await getApi(id);
  formModel.value = dto;
}
</script>

<template>
  <Drawer>
    <div style="width: 800px">
      <Descriptions :colon="false" :column="2" bordered size="small">
        <DescriptionsItem :label="$t('AbpAuditLogging.ApplicationName')">
          {{ formModel.applicationName }}
        </DescriptionsItem>
        <DescriptionsItem :label="$t('AbpAuditLogging.CreationTime')">
          {{ formatToDateTime(formModel.creationTime) }}
        </DescriptionsItem>
        <DescriptionsItem :label="$t('AbpAuditLogging.Identity')">
          {{ formModel.identity }}
        </DescriptionsItem>
        <DescriptionsItem :label="$t('AbpAuditLogging.TenantName')">
          {{ formModel.tenantName }}
        </DescriptionsItem>
        <DescriptionsItem :label="$t('AbpAuditLogging.Actions')">
          {{ formModel.action }}
        </DescriptionsItem>
        <DescriptionsItem :label="$t('AbpAuditLogging.CorrelationId')">
          {{ formModel.correlationId }}
        </DescriptionsItem>
        <DescriptionsItem :label="$t('AbpAuditLogging.UserId')">
          {{ formModel.userId }}
        </DescriptionsItem>
        <DescriptionsItem :label="$t('AbpAuditLogging.UserName')">
          {{ formModel.userName }}
        </DescriptionsItem>
        <DescriptionsItem :label="$t('AbpAuditLogging.ClientId')">
          {{ formModel.clientId }}
        </DescriptionsItem>
        <DescriptionsItem :label="$t('AbpAuditLogging.ClientIpAddress')">
          {{ formModel.clientIpAddress }}
        </DescriptionsItem>
        <DescriptionsItem
          :label="$t('AbpAuditLogging.BrowserInfo')"
          :label-style="{ width: '110px' }"
          :span="2"
        >
          {{ formModel.browserInfo }}
        </DescriptionsItem>
        <DescriptionsItem :label="$t('AbpAuditLogging.Additional')" :span="2">
          {{ formModel.extraProperties }}
        </DescriptionsItem>
      </Descriptions>
    </div>
  </Drawer>
</template>

<style scoped></style>
