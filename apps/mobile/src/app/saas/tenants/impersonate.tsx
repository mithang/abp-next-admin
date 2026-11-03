import { useState } from 'react';
import { useRouter } from 'expo-router';
import { useRouteParams } from '../../../lib/route-params';
import { useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { AppScreen } from '../../../components/ui/AppScreen';
import { AppInput } from '../../../components/ui/AppInput';
import { AppButton } from '../../../components/ui/AppButton';
import { VStack } from '@/components/ui/vstack';
import { Text } from '@/components/ui/text';
import { impersonationErrorText } from '../../../features/auth/impersonation';
import { useAuthStore } from '../../../stores/auth-store';

/**
 * Mạo danh tenant — bản mobile của modal Impersonation trong
 * views/saas/tenants/index.vue của web: nhập tài khoản trong tenant
 * (web mặc định 'admin', bắt buộc), gọi grant impersonation với
 * TenantId + TenantUserName, rồi về Tổng quan như web (location.replace).
 * Backend tự cấm mạo danh lồng nhau; nút bị disabled khi đang mạo danh.
 */
export default function TenantImpersonateScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { tenantId, tenantName } = useRouteParams<{
    tenantId: string;
    tenantName?: string;
  }>();
  const impersonate = useAuthStore((s) => s.impersonate);
  const isImpersonating = useAuthStore((s) => s.isImpersonating);
  const [userName, setUserName] = useState('admin');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const userNameError = userName.trim() ? undefined : t('impersonation.userNameRequired');

  async function handleSubmit() {
    if (userNameError || !tenantId) return;
    setError(null);
    setBusy(true);
    try {
      await impersonate({ tenantId, tenantUserName: userName.trim() });
      queryClient.clear();
      router.replace('/');
    } catch (caught) {
      setError(impersonationErrorText(caught, (key) => t(key)));
    } finally {
      setBusy(false);
    }
  }

  return (
    <AppScreen scrollable title={t('impersonation.tenantTitle')} subtitle={tenantName}>
      <VStack space="sm">
        <Text>{t('impersonation.tenantHint')}</Text>
        <AppInput
          label={t('impersonation.userName')}
          value={userName}
          onChangeText={setUserName}
          placeholder={t('impersonation.userNamePlaceholder')}
          error={userNameError}
          autoCapitalize="none"
          testID="tenant-impersonate-username"
        />
        <AppButton
          title={t('impersonation.impersonateTenant')}
          disabled={Boolean(userNameError) || isImpersonating || !tenantId}
          loading={busy}
          onPress={() => void handleSubmit()}
          testID="tenant-impersonate-submit"
        />
        {error ? <Text>{error}</Text> : null}
      </VStack>
    </AppScreen>
  );
}
