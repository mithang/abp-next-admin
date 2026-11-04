import { useRouteParams } from '../../lib/route-params';
import { useDetailQuery } from '../../lib/use-detail-query';
import { useTranslation } from 'react-i18next';
import { AppScreen } from '../../components/ui/AppScreen';
import { AppDetailField } from '../../components/ui/AppDetailField';

import { AppNavButton } from '../../components/ui/AppNavButton';
import { AppDeleteButton } from '../../components/ui/AppDeleteButton';
import { notFoundElement } from '../../lib/not-found';
import { queryStateElement } from '../../lib/query-state';
import { VStack } from '@/components/ui/vstack';
import { AppBadge } from '../../components/ui/AppBadge';
import { AppOptionalText } from '../../components/ui/AppOptionalText';
import { deleteClaimType, getClaimType } from '../../features/identity/claim-types-api';
import { valueTypeKey } from '../../features/identity/claim-types';
import { navHref } from '../../lib/nav-href';

export default function ClaimTypeDetailScreen() {
  const { t } = useTranslation();
  const { id } = useRouteParams<{ id: string }>();
  const query = useDetailQuery('claim-types', id, getClaimType);

  const queryState = queryStateElement(query);
  if (queryState) return queryState;

  const item = query.data;
  if (!item) return notFoundElement(t('common.empty'));

  return (
    <AppScreen scrollable title={item.name} subtitle={item.id}>
      <VStack space="sm">
        <AppOptionalText value={item.description} />
        <AppDetailField
          label={t('claimTypes.valueTypeLabel')}
          value={t(`claimTypes.valueType.${valueTypeKey(item.valueType)}`)}
        />
        <AppDetailField label={t('claimTypes.regex')} value={item.regex} />
        <AppOptionalText value={item.regexDescription} />
        <AppBadge
          label={
            <>
              {item.required ? t('claimTypes.required') : t('claimTypes.optional')}
              {item.isStatic ? ` · ${t('claimTypes.static')}` : ''}
            </>
          }
        />
        {/* Web ẩn Sửa/Xóa với loại tĩnh (ClaimTypeTable v-if isStatic === false). */}
        {!item.isStatic ? (
          <>
            <AppNavButton
              title={t('claimTypes.editTitle')}
              href={navHref('/claim-types/form', { id: item.id })}
              variant="outline"
              testID="claim-type-edit"
            />
            <AppDeleteButton
              confirmTitle={t('claimTypes.deleteConfirmTitle')}
              confirmMessage={t('claimTypes.deleteConfirmMessage')}
              onDelete={() => deleteClaimType(id)}
              invalidateKey={['claim-types']}
              testID="claim-type-delete"
            />
          </>
        ) : null}
      </VStack>
    </AppScreen>
  );
}
