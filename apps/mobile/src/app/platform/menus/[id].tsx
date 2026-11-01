import { Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { AppScreen } from '../../../components/ui/AppScreen';
import { AppButton } from '../../../components/ui/AppButton';
import { AppErrorState, AppLoading } from '../../../components/ui/AppStates';
import { VStack } from '@/components/ui/vstack';
import { Text } from '@/components/ui/text';
import { deleteMenu, getMenu } from '../../../features/platform/platform-api';
import { toApiError } from '../../../lib/errors';

/** Chi tiết menu: RouteDto + code/component/framework/layoutId/isPublic/startup + meta JSON. */
export default function MenuDetailScreen() {
  const { t } = useTranslation();
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const queryClient = useQueryClient();
  const query = useQuery({ queryKey: ['platform-menus', id], queryFn: () => getMenu(id), enabled: Boolean(id) });
  const deleteMutation = useMutation({
    mutationFn: () => deleteMenu(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['platform-menus-all'] });
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
    <AppScreen title={item.displayName}>
      <VStack space="sm">
        <Text>
          {t('platformMenus.name')}: {item.name}
        </Text>
        <Text>
          {t('platformMenus.code')}: {item.code}
        </Text>
        <Text>
          {t('platformMenus.path')}: {item.path}
        </Text>
        <Text>
          {t('platformMenus.component')}: {item.component}
        </Text>
        <Text>
          {t('platformMenus.framework')}: {item.framework}
        </Text>
        <Text>
          {t('platformMenus.layoutId')}: {item.layoutId}
        </Text>
        {item.parentId ? (
          <Text>
            {t('platformMenus.parentId')}: {item.parentId}
          </Text>
        ) : null}
        {item.redirect ? (
          <Text>
            {t('platformMenus.redirect')}: {item.redirect}
          </Text>
        ) : null}
        {item.description ? (
          <Text>
            {t('platformMenus.description')}: {item.description}
          </Text>
        ) : null}
        <Text>
          {t('platformMenus.isPublic')}: {item.isPublic ? t('common.yes') : t('common.no')}
        </Text>
        <Text>
          {t('platformMenus.startup')}: {item.startup ? t('common.yes') : t('common.no')}
        </Text>
        {item.meta && Object.keys(item.meta).length > 0 ? <Text>Meta: {JSON.stringify(item.meta)}</Text> : null}
        <AppButton
          title={t('platformMenus.editTitle')}
          onPress={() => router.push(`/platform/menus/form?id=${encodeURIComponent(item.id)}`)}
        />
        <AppButton
          title={t('platformMenus.createChildTitle')}
          variant="outline"
          onPress={() =>
            router.push(
              `/platform/menus/form?parentId=${encodeURIComponent(item.id)}&layoutId=${encodeURIComponent(item.layoutId)}`,
            )
          }
        />
        <AppButton
          title={t('common.delete')}
          action="negative"
          variant="outline"
          loading={deleteMutation.isPending}
          onPress={() =>
            Alert.alert(t('platformMenus.deleteConfirmTitle'), t('platformMenus.deleteConfirmMessage'), [
              { text: t('common.cancel'), style: 'cancel' },
              { text: t('common.delete'), style: 'destructive', onPress: () => deleteMutation.mutate() },
            ])
          }
        />
        {deleteMutation.isError ? <Text>{toApiError(deleteMutation.error).message}</Text> : null}
      </VStack>
    </AppScreen>
  );
}
