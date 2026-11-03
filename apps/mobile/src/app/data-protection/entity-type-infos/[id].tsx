import { useRouteParams } from '../../../lib/route-params';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { AppScreen } from '../../../components/ui/AppScreen';
import { notFoundElement } from '../../../lib/not-found';
import { queryStateElement } from '../../../lib/query-state';
import { VStack } from '@/components/ui/vstack';
import { Text } from '@/components/ui/text';
import { getEntityTypeInfo } from '../../../features/auditing/data-protection-api';
import { formatDateTime } from '../../../lib/dates';

export default function EntityTypeInfoDetailScreen() {
  const { t } = useTranslation();
  const { id } = useRouteParams<{ id: string }>();
  const query = useQuery({
    queryKey: ['entity-type-infos', id],
    queryFn: () => getEntityTypeInfo(id),
    enabled: Boolean(id),
  });

  const queryState = queryStateElement(query);
  if (queryState) return queryState;
  const item = query.data;
  if (!item) return notFoundElement(t('common.empty'));

  return (
    <AppScreen scrollable title={item.displayName || item.name} subtitle={item.typeFullName}>
      <VStack space="sm">
        <Text>
          {t('entityTypeInfos.name')}: {item.name}
        </Text>
        <Text>
          {t('entityTypeInfos.typeFullName')}: {item.typeFullName}
        </Text>
        <Text>
          {t('entityTypeInfos.auditEnabled')}:{' '}
          {item.isAuditEnabled ? t('entityTypeInfos.enabled') : t('entityTypeInfos.disabled')}
        </Text>
        {item.creationTime ? (
          <Text>
            {t('entityTypeInfos.creationTime')}: {formatDateTime(item.creationTime)}
          </Text>
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
