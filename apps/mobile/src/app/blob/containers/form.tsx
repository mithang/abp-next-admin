import { useState } from 'react';
import { useRouter } from 'expo-router';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import { AppScreen } from '../../../components/ui/AppScreen';
import { AppInput } from '../../../components/ui/AppInput';
import { AppButton } from '../../../components/ui/AppButton';
import { VStack } from '@/components/ui/vstack';
import { Text } from '@/components/ui/text';
import { createBlobContainer } from '../../../features/blob/blob-api';
import {
  blobContainerFormDefaults,
  blobContainerFormSchema,
  type BlobContainerFormValues,
} from '../../../features/blob/blob-form-schema';
import { toApiError } from '../../../lib/errors';

/**
 * Form tạo container blob: chỉ có name (BlobContainerCreateDto).
 * Không có form sửa vì backend không có Update cho container.
 */
export default function BlobContainerFormScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [submitError, setSubmitError] = useState<string | null>(null);

  const form = useForm<BlobContainerFormValues>({
    resolver: zodResolver(blobContainerFormSchema),
    defaultValues: blobContainerFormDefaults,
  });

  const mutation = useMutation({
    mutationFn: (values: BlobContainerFormValues) =>
      createBlobContainer({ name: values.name.trim() }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['blob-containers'] });
      router.back();
    },
    onError: (error) => setSubmitError(toApiError(error).message),
  });

  return (
    <AppScreen title={t('blobContainers.createTitle')}>
      <VStack space="sm">
        <Controller
          control={form.control}
          name="name"
          render={({ field, fieldState }) => (
            <>
              <AppInput
                value={field.value}
                onChangeText={field.onChange}
                placeholder={t('blobContainers.namePlaceholder')}
                autoCapitalize="none"
              />
              {fieldState.error ? <Text>{t(fieldState.error.message as string)}</Text> : null}
            </>
          )}
        />
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
