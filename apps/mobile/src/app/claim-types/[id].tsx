import { useLocalSearchParams, useRouter } from 'expo-router';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { AppScreen } from '../../components/ui/AppScreen';
import { AppButton } from '../../components/ui/AppButton';
import { AppErrorState } from '../../components/ui/AppStates';
import { queryStateElement } from '../../lib/query-state';
import { VStack } from '@/components/ui/vstack';
import { Text } from '@/components/ui/text';
import { Badge, BadgeText } from '@/components/ui/badge';
import { deleteClaimType, getClaimType } from '../../features/identity/claim-types-api';
import { valueTypeKey } from '../../features/identity/claim-types';
import { toApiError } from '../../lib/errors';
import { showConfirmDialog } from '../../lib/confirm';
import { useInvalidateAndBack } from '../../lib/mutation-success';

export default function ClaimTypeDetailScreen() {
  const { t } = useTranslation();
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const invalidateAndBack = useInvalidateAndBack(['claim-types']);
  const query = useQuery({
    queryKey: ['claim-types', id],
    queryFn: () => getClaimType(id),
    enabled: Boolean(id),
  });
  const deleteMutation = useMutation({
    mutationFn: () => deleteClaimType(id),
    onSuccess: invalidateAndBack,
  });

  const queryState = queryStateElement(query);
  if (queryState) return queryState;

  const item = query.data;
  if (!item) return <AppErrorState message={t('common.empty')} />;

  return (
    <AppScreen scrollable title={item.name} subtitle={item.id}>
      <VStack space="sm">
        {item.description ? <Text>{item.description}</Text> : null}
        <Text>
          {t('claimTypes.valueTypeLabel')}:{' '}
          {t(`claimTypes.valueType.${valueTypeKey(item.valueType)}`)}
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
                showConfirmDialog({
                  title: t('claimTypes.deleteConfirmTitle'),
                  message: t('claimTypes.deleteConfirmMessage'),
                  confirmText: t('common.delete'),
                  cancelText: t('common.cancel'),
                  onConfirm: () => deleteMutation.mutate(),
                })
              }
              testID="claim-type-delete"
            />
            {deleteMutation.isError ? (
              <Text>{toApiError(deleteMutation.error).message}</Text>
            ) : null}
          </>
        ) : null}
      </VStack>
    </AppScreen>
  );
}
