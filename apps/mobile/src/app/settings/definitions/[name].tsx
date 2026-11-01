import { Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { AppScreen } from '../../../components/ui/AppScreen';
import { AppButton } from '../../../components/ui/AppButton';
import { AppErrorState, AppLoading } from '../../../components/ui/AppStates';
import { VStack } from '@/components/ui/vstack';
import { Text } from '@/components/ui/text';
import { deleteSettingDefinition, getSettingDefinition } from '../../../features/settings/settings-definitions-api';
import { toApiError } from '../../../lib/errors';

function Field({ label, value }: { label: string; value?: string }) {
  if (!value) return null;
  return (
    <Text>
      {label}: {value}
    </Text>
  );
}

/**
 * Chi tiết định nghĩa cài đặt. Modal web ẩn nút xác nhận với định nghĩa
 * tĩnh và bảng web vô hiệu nút xóa với bản ghi tĩnh, nên mobile coi tĩnh là
 * chỉ đọc: không Sửa, không Xóa (giống tính năng, khác quyền).
 */
export default function SettingDefinitionDetailScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { name } = useLocalSearchParams<{ name: string }>();
  const query = useQuery({ queryKey: ['setting-definitions', name], queryFn: () => getSettingDefinition(name), enabled: Boolean(name) });
  const deleteMutation = useMutation({
    mutationFn: () => deleteSettingDefinition(name),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['setting-definitions'] });
      router.back();
    },
  });

  if (query.isPending) return <AppLoading />;
  if (query.isError) {
    return <AppErrorState message={toApiError(query.error).message} onRetry={() => void query.refetch()} />;
  }

  const item = query.data;
  if (!item) return <AppErrorState message={t('common.empty')} />;

  return (
    <AppScreen title={item.displayName || item.name} subtitle={item.name}>
      <VStack space="sm">
        <Field label={t('settingDefinitions.name')} value={item.name} />
        <Field label={t('settingDefinitions.displayName')} value={item.displayName} />
        <Field label={t('settingDefinitions.description')} value={item.description} />
        <Field label={t('settingDefinitions.defaultValue')} value={item.defaultValue} />
        <Field label={t('settingDefinitions.providers')} value={item.providers?.join(', ')} />
        <Text>
          {t('settingDefinitions.isEncrypted')}: {item.isEncrypted ? t('settingDefinitions.yes') : t('settingDefinitions.no')}
        </Text>
        <Text>
          {t('settingDefinitions.isInherited')}: {item.isInherited ? t('settingDefinitions.yes') : t('settingDefinitions.no')}
        </Text>
        <Text>
          {t('settingDefinitions.isVisibleToClients')}: {item.isVisibleToClients ? t('settingDefinitions.yes') : t('settingDefinitions.no')}
        </Text>
        {item.isStatic ? <Text>{t('settingDefinitions.static')}</Text> : null}
        {!item.isStatic ? (
          <>
            <AppButton
              title={t('settingDefinitions.editTitle')}
              onPress={() => router.push(`/settings/definitions/form?name=${encodeURIComponent(item.name)}`)}
              variant="outline"
              testID="setting-definition-edit"
            />
            <AppButton
              title={t('common.delete')}
              action="negative"
              variant="outline"
              loading={deleteMutation.isPending}
              onPress={() =>
                Alert.alert(t('settingDefinitions.deleteConfirmTitle'), t('settingDefinitions.deleteConfirmMessage'), [
                  { text: t('common.cancel'), style: 'cancel' },
                  { text: t('common.delete'), style: 'destructive', onPress: () => deleteMutation.mutate() },
                ])
              }
              testID="setting-definition-delete"
            />
          </>
        ) : null}
        {deleteMutation.isError ? <Text>{toApiError(deleteMutation.error).message}</Text> : null}
      </VStack>
    </AppScreen>
  );
}
