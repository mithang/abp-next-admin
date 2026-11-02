import { useState } from 'react';
import { useRouter } from 'expo-router';
import { useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { VStack } from '@/components/ui/vstack';
import { Text } from '@/components/ui/text';
import { Card } from '@/components/ui/card';
import { AppButton } from './AppButton';
import { impersonationErrorText } from '../../features/auth/impersonation';
import { useAuthStore } from '../../stores/auth-store';

/**
 * Banner "đang mạo danh" (vòng 25): chỉ hiện khi còn phiên gốc trong
 * SecureStore. Đây là đường quay về tài khoản gốc luôn nhìn thấy được —
 * nếu không có nó, người dùng có thể kẹt trong phiên mạo danh mà không
 * biết cách thoát. Gắn ở Dashboard và màn Tài khoản.
 */
export function ImpersonationBanner() {
  const { t } = useTranslation();
  const router = useRouter();
  const queryClient = useQueryClient();
  const isImpersonating = useAuthStore((s) => s.isImpersonating);
  const originalUserName = useAuthStore((s) => s.originalUserName);
  const revertImpersonation = useAuthStore((s) => s.revertImpersonation);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isImpersonating) return null;

  async function handleRevert() {
    setError(null);
    setBusy(true);
    try {
      await revertImpersonation();
      queryClient.clear();
      router.replace('/');
    } catch (caught) {
      setError(impersonationErrorText(caught, (key) => t(key)));
    } finally {
      setBusy(false);
    }
  }

  return (
    <Card className="p-4">
      <VStack space="sm">
        <Text>{t('impersonation.banner')}</Text>
        {originalUserName ? (
          <Text>
            {t('impersonation.bannerOriginal')} {originalUserName}
          </Text>
        ) : null}
        <AppButton
          title={t('impersonation.revert')}
          variant="outline"
          action="negative"
          loading={busy}
          onPress={() => void handleRevert()}
          testID="impersonation-revert"
        />
        {error ? <Text>{error}</Text> : null}
      </VStack>
    </Card>
  );
}
