import { useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import { AppScreen } from '../../../components/ui/AppScreen';
import { AppInput } from '../../../components/ui/AppInput';
import { AppButton } from '../../../components/ui/AppButton';
import { AppErrorState, AppLoading } from '../../../components/ui/AppStates';
import { VStack } from '@/components/ui/vstack';
import { Text } from '@/components/ui/text';
import { getData, getDatasAll, moveData } from '../../../features/platform/platform-api';
import {
  dataMoveFormDefaults,
  dataMoveFormSchema,
  type DataMoveFormValues,
} from '../../../features/platform/data-form-schema';
import { toApiError } from '../../../lib/errors';

/**
 * Di chuyển từ điển sang cha khác: PUT /api/platform/datas/{id}/move
 * { parentId }. Để trống = về gốc (DataMoveDto.ParentId nullable).
 * Không cho chọn chính từ điển đang di chuyển làm cha — schema chỉ
 * kiểm chứng dạng Guid, màn này lọc chính nó khỏi gợi ý và chặn gửi
 * khi parentId trùng id (backend sẽ từ chối vòng lặp cha-con).
 */
export default function DataMoveScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { dataId } = useLocalSearchParams<{ dataId: string }>();
  const [submitError, setSubmitError] = useState<string | null>(null);

  const detail = useQuery({
    queryKey: ['platform-datas', dataId],
    queryFn: () => getData(dataId),
    enabled: Boolean(dataId),
  });
  const parentsQuery = useQuery({ queryKey: ['platform-datas-all'], queryFn: () => getDatasAll() });

  const form = useForm<DataMoveFormValues>({
    resolver: zodResolver(dataMoveFormSchema()),
    defaultValues: dataMoveFormDefaults,
  });

  const mutation = useMutation({
    mutationFn: async (values: DataMoveFormValues) => {
      const parentId = values.parentId?.trim() || undefined;
      if (parentId === dataId) {
        throw new Error(t('platformDataDictionaries.moveSelfError'));
      }
      return moveData(dataId, { parentId: parentId ?? null });
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['platform-datas'] });
      router.back();
    },
    onError: (error) => setSubmitError(toApiError(error).message),
  });

  if (detail.isPending) return <AppLoading />;
  if (detail.isError) {
    return (
      <AppErrorState
        message={toApiError(detail.error).message}
        onRetry={() => void detail.refetch()}
      />
    );
  }

  const fieldError = (message?: string) =>
    message && message.startsWith('platformDataDictionaries.') ? t(message) : message;
  const parentsHint =
    parentsQuery.data?.items
      .filter((d) => d.id !== dataId)
      .map((d) => `${d.displayName} — ${d.id}`)
      .join('\n') || t('platformDataDictionaries.parentsLoading');

  return (
    <AppScreen scrollable title={t('platformDataDictionaries.moveTitle')}>
      <VStack space="sm">
        <Text>
          {detail.data?.displayName} ({detail.data?.name})
        </Text>
        <Controller
          control={form.control}
          name="parentId"
          render={({ field, fieldState }) => (
            <AppInput
              label={t('platformDataDictionaries.parent')}
              value={field.value ?? ''}
              onChangeText={field.onChange}
              placeholder={t('platformDataDictionaries.movePlaceholder')}
              autoCapitalize="none"
              error={fieldError(fieldState.error?.message)}
            />
          )}
        />
        <Text>
          {t('platformDataDictionaries.parentsHint')}: {parentsHint}
        </Text>
        {submitError ? <Text>{submitError}</Text> : null}
        <AppButton
          title={t('common.save')}
          loading={mutation.isPending}
          onPress={() => void form.handleSubmit((values) => mutation.mutate(values))()}
        />
      </VStack>
    </AppScreen>
  );
}
