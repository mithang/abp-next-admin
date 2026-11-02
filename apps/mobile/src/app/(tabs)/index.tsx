import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { AppScreen } from '../../components/ui/AppScreen';
import { AppErrorState, AppLoading } from '../../components/ui/AppStates';
import { VStack } from '@/components/ui/vstack';
import { Text } from '@/components/ui/text';
import { Card } from '@/components/ui/card';
import { ImpersonationBanner } from '../../components/ui/ImpersonationBanner';
import { getMyProfile } from '../../features/auth/api';
import { getUsersPaged } from '../../features/identity/api';
import { getAllMenus } from '../../features/dashboard/api';
import { toApiError } from '../../lib/errors';

export default function DashboardScreen() {
  const { t } = useTranslation();
  const profile = useQuery({ queryKey: ['profile'], queryFn: getMyProfile });
  const users = useQuery({
    queryKey: ['users', 'total'],
    queryFn: () => getUsersPaged({ maxResultCount: 1 }),
  });
  const menus = useQuery({ queryKey: ['menus', 'all'], queryFn: getAllMenus });

  if (profile.isPending || users.isPending || menus.isPending) {
    return <AppLoading label={t('common.loading')} />;
  }
  const failed = profile.error ?? users.error ?? menus.error;
  if (failed) {
    return (
      <AppErrorState
        message={toApiError(failed).message}
        onRetry={() => void Promise.all([profile.refetch(), users.refetch(), menus.refetch()])}
      />
    );
  }

  const userName = profile.data?.userName ?? profile.data?.name ?? '';
  const menuCount = menus.data?.items?.length ?? 0;

  return (
    <AppScreen
      title={t('dashboard.title')}
      subtitle={`${t('dashboard.welcome')}${userName ? `, ${userName}` : ''}`}
    >
      <VStack space="md">
        <ImpersonationBanner />
        <Card className="p-4">
          <Text>{t('users.total')}</Text>
          <Text>{users.data?.totalCount ?? 0}</Text>
        </Card>
        <Card className="p-4">
          <Text>{t('dashboard.menus')}</Text>
          <Text>{menuCount}</Text>
        </Card>
      </VStack>
    </AppScreen>
  );
}
