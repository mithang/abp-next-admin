import { useLocalSearchParams } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { AppScreen } from '../../components/ui/AppScreen';
import { AppErrorState, AppLoading } from '../../components/ui/AppStates';
import { VStack } from '@/components/ui/vstack';
import { Text } from '@/components/ui/text';
import { Badge, BadgeText } from '@/components/ui/badge';
import { getClaimType } from '../../features/identity/claim-types-api';
import { valueTypeKey } from '../../features/identity/claim-types';
import { toApiError } from '../../lib/errors';

export default function ClaimTypeDetailScreen() {
  const { t } = useTranslation();
  const { id } = useLocalSearchParams<{ id: string }>();
  const query = useQuery({ queryKey: ['claim-types', id], queryFn: () => getClaimType(id), enabled: Boolean(id) });

  if (query.isPending) return <AppLoading />;
  if (query.isError) {
    return <AppErrorState message={toApiError(query.error).message} onRetry={() => void query.refetch()} />;
  }

  const item = query.data;
  if (!item) return <AppErrorState message={t('common.empty')} />;

  return (
    <AppScreen title={item.name} subtitle={item.id}>
      <VStack space="sm">
        {item.description ? <Text>{item.description}</Text> : null}
        <Text>
          {t('claimTypes.valueTypeLabel')}: {t(`claimTypes.valueType.${valueTypeKey(item.valueType)}`)}
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
      </VStack>
    </AppScreen>
  );
}
