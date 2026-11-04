import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { AppScreen } from '../../components/ui/AppScreen';
import { AppDetailField } from '../../components/ui/AppDetailField';

import { AppButton } from '../../components/ui/AppButton';
import { VStack } from '@/components/ui/vstack';
import { ImpersonationBanner } from '../../components/ui/ImpersonationBanner';
import { getMyProfile } from '../../features/auth/api';
import { useAuthStore } from '../../stores/auth-store';
import { queryClient } from '../../lib/query-client';
import { queryStateElement } from '../../lib/query-state';

export default function AccountScreen() {
  const { t } = useTranslation();
  const signOut = useAuthStore((s) => s.signOut);
  const profile = useQuery({ queryKey: ['profile'], queryFn: getMyProfile });

  const queryState = queryStateElement(profile);
  if (queryState) return queryState;

  const data = profile.data;

  return (
    <AppScreen scrollable title={t('account.title')}>
      <VStack space="sm">
        <ImpersonationBanner />
        <AppDetailField label={t('account.username')} value={data?.userName ?? ''} />
        <AppDetailField label={t('account.email')} value={data?.email ?? ''} />
        {data?.phoneNumber ? (
          <AppDetailField label={t('account.phone')} value={data.phoneNumber} />
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
