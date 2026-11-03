import { useLocalSearchParams } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { AppScreen } from '../../components/ui/AppScreen';
import { AppNavButton } from '../../components/ui/AppNavButton';
import { AppDeleteButton } from '../../components/ui/AppDeleteButton';
import { notFoundElement } from '../../lib/not-found';
import { queryStateElement } from '../../lib/query-state';
import { VStack } from '@/components/ui/vstack';
import { Text } from '@/components/ui/text';
import { Badge, BadgeText } from '@/components/ui/badge';
import { deleteClaimType, getClaimType } from '../../features/identity/claim-types-api';
import { valueTypeKey } from '../../features/identity/claim-types';

export default function ClaimTypeDetailScreen() {
  const { t } = useTranslation();
  const { id } = useLocalSearchParams<{ id: string }>();
  const query = useQuery({
    queryKey: ['claim-types', id],
    queryFn: () => getClaimType(id),
    enabled: Boolean(id),
  });

  const queryState = queryStateElement(query);
  if (queryState) return queryState;

  const item = query.data;
  if (!item) return notFoundElement(t('common.empty'));

  return (
    <AppScreen scrollable title={item.name} subtitle={item.id}>
      <VStack space="sm">
        {item.description ? <Text>{item.description}</Text> : null}
        <Text>
          {t('claimTypes.valueTypeLabel')}:{' '}
          {t(`claimTypes.valueType.${valueTypeKey(item.valueType)}`)}
        </Text>
        {item.regex ? (
          <Text>
            {t('claimTypes.regex')}: {item.regex}
          </Text>
        ) : null}
        {item.regexDescription ? <Text>{item.regexDescription}</Text> : null}
        <Badge variant="default" className="self-start">
          <BadgeText>
            {item.required ? t('claimTypes.required') : t('claimTypes.optional')}
            {item.isStatic ? ` · ${t('claimTypes.static')}` : ''}
          </BadgeText>
        </Badge>
        {/* Web ẩn Sửa/Xóa với loại tĩnh (ClaimTypeTable v-if isStatic === false). */}
        {!item.isStatic ? (
          <>
            <AppNavButton
              title={t('claimTypes.editTitle')}
              href={`/claim-types/form?id=${encodeURIComponent(item.id)}`}
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
