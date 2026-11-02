import { useState } from 'react';
import { useLocalSearchParams } from 'expo-router';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import { AppScreen } from '../../../components/ui/AppScreen';
import { AppInput } from '../../../components/ui/AppInput';
import { AppFormSubmit } from '../../../components/ui/AppFormSubmit';
import { VStack } from '@/components/ui/vstack';
import { Text } from '@/components/ui/text';
import { getData, getDatasAll, moveData } from '../../../features/platform/platform-api';
import {
  dataMoveFormDefaults,
  dataMoveFormSchema,
  type DataMoveFormValues,
} from '../../../features/platform/data-form-schema';
import { toApiError } from '../../../lib/errors';
import { queryStateElement } from '../../../lib/query-state';
import { createFieldError } from '../../../lib/field-error';
import { useInvalidateAndBack } from '../../../lib/mutation-success';

/**
 * Di chuyển từ điển sang cha khác: PUT /api/platform/datas/{id}/move
 * { parentId }. Để trống = về gốc (DataMoveDto.ParentId nullable).
 * Không cho chọn chính từ điển đang di chuyển làm cha — schema chỉ
 * kiểm chứng dạng Guid, màn này lọc chính nó khỏi gợi ý và chặn gửi
 * khi parentId trùng id (backend sẽ từ chối vòng lặp cha-con).
 */
export default function DataMoveScreen() {
  const { t } = useTranslation();
  const invalidateAndBack = useInvalidateAndBack(['platform-datas']);
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
    onSuccess: invalidateAndBack,
    onError: (error) => setSubmitError(toApiError(error).message),
  });

  const queryState = queryStateElement(detail);
  if (queryState) return queryState;

  const fieldError = createFieldError(t, 'platformDataDictionaries');
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
        <AppFormSubmit
          error={submitError}
          title={t('common.save')}
          loading={mutation.isPending}
          onPress={() => void form.handleSubmit((values) => mutation.mutate(values))()}
        />
      </VStack>
    </AppScreen>
  );
}
