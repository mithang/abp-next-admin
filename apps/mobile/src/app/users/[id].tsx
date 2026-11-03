import { useState } from 'react';
import { useRouter } from 'expo-router';
import { useRouteParams } from '../../lib/route-params';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { AppScreen } from '../../components/ui/AppScreen';
import { AppButton } from '../../components/ui/AppButton';
import { AppNavButton } from '../../components/ui/AppNavButton';
import { notFoundElement } from '../../lib/not-found';
import { queryStateElement } from '../../lib/query-state';
import { stateErrorElement } from '../../lib/state-error';
import { VStack } from '@/components/ui/vstack';
import { Text } from '@/components/ui/text';
import { getUser } from '../../features/identity/api';
import { displayName } from '../../features/identity/types';
import { impersonationErrorText } from '../../features/auth/impersonation';
import { useAuthStore } from '../../stores/auth-store';
import { showConfirmDialog } from '../../lib/confirm';
import { navHref } from '../../lib/nav-href';

export default function UserDetailScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { id } = useRouteParams<{ id: string }>();
  const query = useQuery({
    queryKey: ['users', id],
    queryFn: () => getUser(id),
    enabled: Boolean(id),
  });
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

  const queryState = queryStateElement(query);
  if (queryState) return queryState;

  const user = query.data;
  if (!user) return notFoundElement(t('common.empty'));

  return (
    <AppScreen scrollable title={displayName(user)} subtitle={user.userName}>
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
        <AppNavButton
          title={t('menuAllot.title')}
          href={navHref('/platform/menu-allot', {
            subject: 'user',
            id: user.id,
            label: displayName(user),
          })}
          variant="outline"
          testID="user-menu-allot"
        />
        <AppButton
          title={t('impersonation.impersonateUser')}
          variant="outline"
          disabled={isImpersonating}
          loading={impersonating}
          onPress={() =>
            showConfirmDialog({
              title: t('impersonation.confirmTitle'),
              message: t('impersonation.confirmUserMessage'),
              confirmText: t('impersonation.impersonateUser'),
              cancelText: t('common.cancel'),
              onConfirm: () => void handleImpersonate(user.id, user.tenantId),
            })
          }
          testID="user-impersonate"
        />
        {stateErrorElement(impersonateError)}
      </VStack>
    </AppScreen>
  );
}
