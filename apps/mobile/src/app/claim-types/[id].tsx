import { Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { AppScreen } from '../../components/ui/AppScreen';
import { AppButton } from '../../components/ui/AppButton';
import { AppErrorState, AppLoading } from '../../components/ui/AppStates';
import { VStack } from '@/components/ui/vstack';
import { Text } from '@/components/ui/text';
import { Badge, BadgeText } from '@/components/ui/badge';
import { deleteClaimType, getClaimType } from '../../features/identity/claim-types-api';
import { valueTypeKey } from '../../features/identity/claim-types';
import { toApiError } from '../../lib/errors';

export default function ClaimTypeDetailScreen() {
  const { t } = useTranslation();
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const queryClient = useQueryClient();
  const query = useQuery({ queryKey: ['claim-types', id], queryFn: () => getClaimType(id), enabled: Boolean(id) });
  const deleteMutation = useMutation({
    mutationFn: () => deleteClaimType(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['claim-types'] });
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
    <AppScreen title={item.name} subtitle={item.id}>
      <VStack space="sm">
        {item.description ? <Text>{item.description}</Text> : null}
        <Text>
          {t('claimTypes.valueTypeLabel')}: {t(`claimTypes.valueType.${valueTypeKey(item.valueType)}`)}
        </Text>
        {item.regex ? (
          <Text>
            {t('claimTypes.regex')}: {item.regex}
          </Text>
        ) : null}
        {item.regexDescription ? <Text>{item.regexDescription}</Text> : null}
        <Badge variant="default" className="self-start">
          <BadgeText>
            {item.required ? t('claimTypes.required') : t('claimTypes.optional')}
            {item.isStatic ? ` · ${t('claimTypes.static')}` : ''}
          </BadgeText>
        </Badge>
        {/* Web ẩn Sửa/Xóa với loại tĩnh (ClaimTypeTable v-if isStatic === false). */}
        {!item.isStatic ? (
          <>
            <AppButton
              title={t('claimTypes.editTitle')}
              onPress={() => router.push(`/claim-types/form?id=${encodeURIComponent(item.id)}`)}
              variant="outline"
              testID="claim-type-edit"
            />
            <AppButton
              title={t('common.delete')}
              action="negative"
              variant="outline"
              loading={deleteMutation.isPending}
              onPress={() =>
                Alert.alert(t('claimTypes.deleteConfirmTitle'), t('claimTypes.deleteConfirmMessage'), [
                  { text: t('common.cancel'), style: 'cancel' },
                  { text: t('common.delete'), style: 'destructive', onPress: () => deleteMutation.mutate() },
                ])
              }
              testID="claim-type-delete"
            />
            {deleteMutation.isError ? <Text>{toApiError(deleteMutation.error).message}</Text> : null}
          </>
        ) : null}
      </VStack>
    </AppScreen>
  );
}
