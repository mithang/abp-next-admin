import { useRouteParams } from '../../../lib/route-params';
import { useDetailQuery } from '../../../lib/use-detail-query';
import { useTranslation } from 'react-i18next';
import { AppScreen } from '../../../components/ui/AppScreen';
import { AppDetailField } from '../../../components/ui/AppDetailField';

import { AppNavButton } from '../../../components/ui/AppNavButton';
import { AppDeleteButton } from '../../../components/ui/AppDeleteButton';
import { notFoundElement } from '../../../lib/not-found';
import { queryStateElement } from '../../../lib/query-state';
import { VStack } from '@/components/ui/vstack';
import { deleteTenant, getTenant } from '../../../features/saas/saas-api';
import { navHref } from '../../../lib/nav-href';

/**
 * Chi tiết tenant. Nút "Chuỗi kết nối" mở màn quản lý connection string
 * (đặt/xóa/kiểm tra) — đúng modal ConnectionStrings của web; giá trị
 * connection string đã lưu KHÔNG hiển thị (credential). Nút "Tính năng"
 * mở màn giá trị tính năng theo tenant (vòng 24, đúng FeatureModal web
 * với providerName 'T'). Nút "Mạo danh tenant" (vòng 25) mở màn nhập
 * tài khoản trong tenant, đúng modal Impersonation của web.
 */
export default function TenantDetailScreen() {
  const { t } = useTranslation();
  const { id } = useRouteParams<{ id: string }>();
  const query = useDetailQuery('saas-tenants', id, getTenant);

  const queryState = queryStateElement(query);
  if (queryState) return queryState;
  const item = query.data;
  if (!item) return notFoundElement(t('common.empty'));

  return (
    <AppScreen scrollable title={item.name} subtitle={item.normalizedName}>
      <VStack space="sm">
        <AppDetailField
          label={t('saasTenants.isActive')}
          value={item.isActive ? t('saasTenants.active') : t('saasTenants.inactive')}
        />
        <AppDetailField label={t('saasTenants.edition')} value={item.editionName} />
        <AppDetailField label={t('saasTenants.enableTime')} value={item.enableTime} />
        <AppDetailField label={t('saasTenants.disableTime')} value={item.disableTime} />
        <AppDetailField label={t('saasTenants.creationTime')} value={item.creationTime} />
        {item.extraProperties && Object.keys(item.extraProperties).length > 0 ? (
          <AppDetailField
            label={t('saasTenants.extraProperties')}
            value={JSON.stringify(item.extraProperties)}
          />
        ) : null}
        <AppNavButton
          title={t('saasTenants.editTitle')}
          href={navHref('/saas/tenants/form', { id: item.id })}
          variant="outline"
        />
        <AppNavButton
          title={t('saasTenants.connectionStrings')}
          href={navHref('/saas/tenants/connection-strings', { tenantId: item.id })}
          variant="outline"
        />
        <AppNavButton
          title={t('saasTenants.features')}
          href={navHref('/saas/tenants/features', { tenantId: item.id, tenantName: item.name })}
          variant="outline"
        />
        <AppNavButton
          title={t('saasTenants.impersonate')}
          href={navHref('/saas/tenants/impersonate', { tenantId: item.id, tenantName: item.name })}
          variant="outline"
          testID="saas-tenant-impersonate"
        />
        <AppDeleteButton
          confirmTitle={t('saasTenants.deleteConfirmTitle')}
          confirmMessage={t('saasTenants.deleteConfirmMessage')}
          onDelete={() => deleteTenant(id)}
          invalidateKey={['saas-tenants']}
          testID="saas-tenant-delete"
        />
      </VStack>
    </AppScreen>
  );
}
