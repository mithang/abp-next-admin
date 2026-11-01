import { useLocalSearchParams } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { AppScreen } from '../../components/ui/AppScreen';
import { AppErrorState, AppLoading } from '../../components/ui/AppStates';
import { VStack } from '@/components/ui/vstack';
import { Text } from '@/components/ui/text';
import { Badge, BadgeText } from '@/components/ui/badge';
import { getRole } from '../../features/identity/roles-api';
import { roleFlags } from '../../features/identity/roles-types';
import { toApiError } from '../../lib/errors';

export default function RoleDetailScreen() {
  const { t } = useTranslation();
  const { id } = useLocalSearchParams<{ id: string }>();
  const query = useQuery({ queryKey: ['roles', id], queryFn: () => getRole(id), enabled: Boolean(id) });

  if (query.isPending) return <AppLoading />;
  if (query.isError) {
    return <AppErrorState message={toApiError(query.error).message} onRetry={() => void query.refetch()} />;
  }

  const role = query.data;
  if (!role) return <AppErrorState message={t('common.empty')} />;

  const flagLabels: Record<string, string> = {
    default: t('roles.isDefault'),
    public: t('roles.isPublic'),
    static: t('roles.isStatic'),
  };

  return (
    <AppScreen title={role.name} subtitle={role.id}>
      <VStack space="sm">
        {roleFlags(role).map((flag) => (
          <Badge key={flag} variant="default" className="self-start">
            <BadgeText>{flagLabels[flag]}</BadgeText>
          </Badge>
        ))}
        {roleFlags(role).length === 0 ? <Text>{t('roles.noFlags')}</Text> : null}
      </VStack>
    </AppScreen>
  );
}
