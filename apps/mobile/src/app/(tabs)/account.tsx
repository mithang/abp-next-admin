import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { AppScreen } from '../../components/ui/AppScreen';
import { AppButton } from '../../components/ui/AppButton';
import { AppErrorState, AppLoading } from '../../components/ui/AppStates';
import { VStack } from '@/components/ui/vstack';
import { Text } from '@/components/ui/text';
import { ImpersonationBanner } from '../../components/ui/ImpersonationBanner';
import { getMyProfile } from '../../features/auth/api';
import { useAuthStore } from '../../stores/auth-store';
import { queryClient } from '../../lib/query-client';
import { toApiError } from '../../lib/errors';

export default function AccountScreen() {
  const { t } = useTranslation();
  const signOut = useAuthStore((s) => s.signOut);
  const profile = useQuery({ queryKey: ['profile'], queryFn: getMyProfile });

  if (profile.isPending) return <AppLoading />;
  if (profile.isError) {
    return (
      <AppErrorState
        message={toApiError(profile.error).message}
        onRetry={() => void profile.refetch()}
      />
    );
  }

  const data = profile.data;

  return (
    <AppScreen title={t('account.title')}>
      <VStack space="sm">
        <ImpersonationBanner />
        <Text>
          {t('account.username')}: {data?.userName ?? ''}
        </Text>
        <Text>
          {t('account.email')}: {data?.email ?? ''}
        </Text>
        {data?.phoneNumber ? (
          <Text>
            {t('account.phone')}: {data.phoneNumber}
          </Text>
        ) : null}
      </VStack>
      <AppButton
        title={t('auth.logout')}
        variant="outline"
        action="negative"
        onPress={() => {
          queryClient.clear();
          void signOut();
        }}
      />
    </AppScreen>
  );
}
