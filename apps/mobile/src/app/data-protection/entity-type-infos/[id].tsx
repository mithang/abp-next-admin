import { useRouteParams } from '../../../lib/route-params';
import { useDetailQuery } from '../../../lib/use-detail-query';
import { useTranslation } from 'react-i18next';
import { AppScreen } from '../../../components/ui/AppScreen';
import { AppDetailField } from '../../../components/ui/AppDetailField';

import { notFoundElement } from '../../../lib/not-found';
import { queryStateElement } from '../../../lib/query-state';
import { VStack } from '@/components/ui/vstack';
import { Text } from '@/components/ui/text';
import { getEntityTypeInfo } from '../../../features/auditing/data-protection-api';
import { formatDateTime } from '../../../lib/dates';

export default function EntityTypeInfoDetailScreen() {
  const { t } = useTranslation();
  const { id } = useRouteParams<{ id: string }>();
  const query = useDetailQuery('entity-type-infos', id, getEntityTypeInfo);

  const queryState = queryStateElement(query);
  if (queryState) return queryState;
  const item = query.data;
  if (!item) return notFoundElement(t('common.empty'));

  return (
    <AppScreen scrollable title={item.displayName || item.name} subtitle={item.typeFullName}>
      <VStack space="sm">
        <AppDetailField label={t('entityTypeInfos.name')} value={item.name} />
        <AppDetailField label={t('entityTypeInfos.typeFullName')} value={item.typeFullName} />
        <AppDetailField
          label={t('entityTypeInfos.auditEnabled')}
          value={item.isAuditEnabled ? t('entityTypeInfos.enabled') : t('entityTypeInfos.disabled')}
        />
        {item.creationTime ? (
          <AppDetailField
            label={t('entityTypeInfos.creationTime')}
            value={formatDateTime(item.creationTime)}
          />
        ) : null}
        <Text>{t('entityTypeInfos.properties')}:</Text>
        {(item.properties ?? []).map((prop) => (
          <VStack key={prop.id} space="xs">
            <Text>
              {prop.displayName || prop.name} ({prop.javaScriptType})
            </Text>
            <Text>{prop.typeFullName}</Text>
            {(prop.enums ?? []).map((e) => (
              <Text key={e.id}>
                {e.name} = {e.value}
              </Text>
            ))}
          </VStack>
        ))}
        {(item.properties ?? []).length === 0 ? <Text>{t('common.empty')}</Text> : null}
      </VStack>
    </AppScreen>
  );
}
