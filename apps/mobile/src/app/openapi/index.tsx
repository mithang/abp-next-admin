import { useState } from 'react';
import * as WebBrowser from 'expo-web-browser';
import { useTranslation } from 'react-i18next';
import { AppScreen } from '../../components/ui/AppScreen';
import { AppButton } from '../../components/ui/AppButton';
import { AppOptionalText } from '../../components/ui/AppOptionalText';
import { VStack } from '@/components/ui/vstack';
import { Text } from '@/components/ui/text';
import { config } from '../../lib/config';

/**
 * Tài liệu API: trên web trang này là IFrame nhúng Swagger UI
 * (/manage/openapi). Mobile không cài WebView (native module, cần dev build)
 * nên màn này mở đúng Swagger UI của backend trong trình duyệt hệ thống qua
 * expo-web-browser (đã có sẵn cho OIDC). URL lấy từ cấu hình apiUrl, không
 * hardcode host: /swagger là UI mặc định của app.UseSwagger() ở AllInOne
 * (Program.cs), spec JSON ở /swagger/v1/swagger.json.
 */
export default function ApiDocsScreen() {
  const { t } = useTranslation();
  const [error, setError] = useState<string | null>(null);
  const swaggerUrl = `${config.apiUrl.replace(/\/$/, '')}/swagger`;

  const openDocs = async () => {
    setError(null);
    try {
      await WebBrowser.openBrowserAsync(swaggerUrl);
    } catch (e) {
      setError(e instanceof Error ? e.message : t('apiDocs.openFailed'));
    }
  };

  return (
    <AppScreen scrollable title={t('apiDocs.title')} subtitle={t('apiDocs.subtitle')}>
      <VStack space="md">
        <Text>{t('apiDocs.description')}</Text>
        <Text>{swaggerUrl}</Text>
        <AppButton
          title={t('apiDocs.open')}
          onPress={() => void openDocs()}
          testID="api-docs-open"
        />
        <AppOptionalText value={error} />
      </VStack>
    </AppScreen>
  );
}
