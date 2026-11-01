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
import { createEdition, getEdition, updateEdition } from '../../../features/saas/saas-api';
import {
  editionFormDefaults,
  editionFormSchema,
  parseExtraPropertiesJson,
  type EditionFormValues,
} from '../../../features/saas/edition-form-schema';
import { toApiError } from '../../../lib/errors';

/** Form tạo/sửa phiên bản: chỉ displayName (+ extraProperties JSON); sửa gửi kèm concurrencyStamp. */
export default function EditionFormScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const isEdit = Boolean(id);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const detail = useQuery({ queryKey: ['saas-editions', id], queryFn: () => getEdition(id as string), enabled: isEdit });

  const form = useForm<EditionFormValues>({
    resolver: zodResolver(editionFormSchema),
    defaultValues: editionFormDefaults,
    values: detail.data
      ? {
          displayName: detail.data.displayName,
          extraPropertiesJson:
            detail.data.extraProperties && Object.keys(detail.data.extraProperties).length > 0
              ? JSON.stringify(detail.data.extraProperties)
              : '',
        }
      : undefined,
  });

  const mutation = useMutation({
    mutationFn: async (values: EditionFormValues) => {
      const shared = {
        displayName: values.displayName.trim(),
        extraProperties: parseExtraPropertiesJson(values),
      };
      if (isEdit) {
        return updateEdition(id as string, { ...shared, concurrencyStamp: detail.data?.concurrencyStamp ?? '' });
      }
      return createEdition(shared);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['saas-editions'] });
      router.back();
    },
    onError: (error) => setSubmitError(toApiError(error).message),
  });

  if (isEdit && detail.isPending) return <AppLoading />;
  if (isEdit && detail.isError) {
    return <AppErrorState message={toApiError(detail.error).message} onRetry={() => void detail.refetch()} />;
  }

  const fieldError = (message?: string) => (message && message.startsWith('saasEditions.') ? t(message) : message);

  return (
    <AppScreen title={t(isEdit ? 'saasEditions.editTitle' : 'saasEditions.createTitle')}>
      <VStack space="sm">
        <Controller
          control={form.control}
          name="displayName"
          render={({ field, fieldState }) => (
            <AppInput
              label={t('saasEditions.displayName')}
              value={field.value}
              onChangeText={field.onChange}
              placeholder={t('saasEditions.displayNamePlaceholder')}
              error={fieldError(fieldState.error?.message)}
            />
          )}
        />
        <Controller
          control={form.control}
          name="extraPropertiesJson"
          render={({ field, fieldState }) => (
            <AppInput
              label={t('saasEditions.extraProperties')}
              value={field.value ?? ''}
              onChangeText={field.onChange}
              placeholder={t('saasEditions.extraPropertiesPlaceholder')}
              autoCapitalize="none"
              multiline
              error={fieldError(fieldState.error?.message)}
            />
          )}
        />
        {submitError ? <Text>{submitError}</Text> : null}
        <AppButton
          title={t('common.save')}
          loading={mutation.isPending}
          disabled={mutation.isPending}
          onPress={() => void form.handleSubmit((values) => mutation.mutate(values))()}
        />
      </VStack>
    </AppScreen>
  );
}
