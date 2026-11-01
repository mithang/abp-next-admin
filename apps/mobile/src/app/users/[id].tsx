import { useLocalSearchParams } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { AppScreen } from '../../components/ui/AppScreen';
import { AppErrorState, AppLoading } from '../../components/ui/AppStates';
import { VStack } from '@/components/ui/vstack';
import { Text } from '@/components/ui/text';
import { getUser } from '../../features/identity/api';
import { displayName } from '../../features/identity/types';
import { toApiError } from '../../lib/errors';

export default function UserDetailScreen() {
  const { t } = useTranslation();
  const { id } = useLocalSearchParams<{ id: string }>();
  const query = useQuery({ queryKey: ['users', id], queryFn: () => getUser(id), enabled: Boolean(id) });

  if (query.isPending) return <AppLoading />;
  if (query.isError) {
    return <AppErrorState message={toApiError(query.error).message} onRetry={() => void query.refetch()} />;
  }

  const user = query.data;
  if (!user) return <AppErrorState message={t('common.empty')} />;

  return (
    <AppScreen title={displayName(user)} subtitle={user.userName}>
      <VStack space="sm">
        <Text>
          {t('account.email')}: {user.email}
        </Text>
        {user.phoneNumber ? (
          <Text>
            {t('account.phone')}: {user.phoneNumber}
          </Text>
        ) : null}
        <Text>
          {t('users.active')}: {user.isActive ? '✓' : '—'}
        </Text>
        <Text>
          {t('users.emailConfirmed')}: {user.emailConfirmed ? '✓' : '—'}
        </Text>
        <Text>{user.roleNames.join(', ')}</Text>
      </VStack>
    </AppScreen>
  );
}
