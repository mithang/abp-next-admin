import { useState } from 'react';
import { Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { AppScreen } from '../../components/ui/AppScreen';
import { AppButton } from '../../components/ui/AppButton';
import { AppErrorState, AppLoading } from '../../components/ui/AppStates';
import { VStack } from '@/components/ui/vstack';
import { Text } from '@/components/ui/text';
import { getUser } from '../../features/identity/api';
import { displayName } from '../../features/identity/types';
import { impersonationErrorText } from '../../features/auth/impersonation';
import { useAuthStore } from '../../stores/auth-store';
import { toApiError } from '../../lib/errors';

export default function UserDetailScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { id } = useLocalSearchParams<{ id: string }>();
  const query = useQuery({ queryKey: ['users', id], queryFn: () => getUser(id), enabled: Boolean(id) });
  const impersonate = useAuthStore((s) => s.impersonate);
  const isImpersonating = useAuthStore((s) => s.isImpersonating);
  const [impersonating, setImpersonating] = useState(false);
  const [impersonateError, setImpersonateError] = useState<string | null>(null);

  async function handleImpersonate(userId: string, tenantId?: string | null) {
    setImpersonateError(null);
    setImpersonating(true);
    try {
      await impersonate({ userId, tenantId: tenantId ?? undefined });
      // Phiên đã đổi: xóa toàn bộ cache của tài khoản cũ rồi về Tổng quan,
      // đúng web (location.replace('/')).
      queryClient.clear();
      router.replace('/');
    } catch (error) {
      setImpersonateError(impersonationErrorText(error, (key) => t(key)));
    } finally {
      setImpersonating(false);
    }
  }

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
        <AppButton
          title={t('menuAllot.title')}
          variant="outline"
          onPress={() =>
            router.push(
              `/platform/menu-allot?subject=user&id=${encodeURIComponent(user.id)}&label=${encodeURIComponent(displayName(user))}`,
            )
          }
          testID="user-menu-allot"
        />
        <AppButton
          title={t('impersonation.impersonateUser')}
          variant="outline"
          disabled={isImpersonating}
          loading={impersonating}
          onPress={() =>
            Alert.alert(t('impersonation.confirmTitle'), t('impersonation.confirmUserMessage'), [
              { text: t('common.cancel'), style: 'cancel' },
              {
                text: t('impersonation.impersonateUser'),
                style: 'destructive',
                onPress: () => void handleImpersonate(user.id, user.tenantId),
              },
            ])
          }
          testID="user-impersonate"
        />
        {impersonateError ? <Text>{impersonateError}</Text> : null}
      </VStack>
    </AppScreen>
  );
}
