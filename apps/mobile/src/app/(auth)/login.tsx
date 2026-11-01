import { useEffect, useState } from 'react';
import * as AuthSession from 'expo-auth-session';
import { useTranslation } from 'react-i18next';
import { AppScreen } from '../../components/ui/AppScreen';
import { AppButton } from '../../components/ui/AppButton';
import { AppErrorState, AppLoading } from '../../components/ui/AppStates';
import { VStack } from '@/components/ui/vstack';
import { Text } from '@/components/ui/text';
import { config } from '../../lib/config';
import { redirectUri, exchangeCode } from '../../features/auth/oidc';
import { useAuthStore } from '../../stores/auth-store';

export default function LoginScreen() {
  const { t } = useTranslation();
  const setAuthenticated = useAuthStore((s) => s.setAuthenticated);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const discovery = AuthSession.useAutoDiscovery(config.authority);
  const [request, response, promptAsync] = AuthSession.useAuthRequest(
    {
      clientId: config.clientId,
      scopes: config.scopes,
      redirectUri,
      responseType: AuthSession.ResponseType.Code,
      usePKCE: true,
    },
    discovery,
  );

  useEffect(() => {
    if (response?.type !== 'success' || !discovery || !request) return;
    void (async () => {
      setBusy(true);
      try {
        await exchangeCode(discovery, request, response.params.code);
        setAuthenticated(null);
      } catch {
        setError(t('auth.loginFailed'));
      } finally {
        setBusy(false);
      }
    })();
  }, [response, discovery, request, setAuthenticated, t]);

  if (!discovery) return <AppLoading label={t('common.loading')} />;
  if (error) return <AppErrorState message={error} onRetry={() => setError(null)} />;
  if (busy) return <AppLoading label={t('auth.loggingIn')} />;

  return (
    <AppScreen title={t('app.name')} subtitle={t('auth.loginSubtitle')}>
      <VStack space="md">
        <Text>{t('auth.loginHint')}</Text>
        <AppButton
          title={t('auth.login')}
          onPress={() => void promptAsync()}
          disabled={!request}
          testID="login-button"
        />
      </VStack>
    </AppScreen>
  );
}
