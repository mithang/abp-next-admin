import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import { AppScreen } from '../../../components/ui/AppScreen';
import { AppFormInput } from '../../../components/ui/AppFormInput';
import { AppFormSubmit } from '../../../components/ui/AppFormSubmit';
import { VStack } from '@/components/ui/vstack';
import { createBlobContainer } from '../../../features/blob/blob-api';
import {
  blobContainerFormDefaults,
  blobContainerFormSchema,
  type BlobContainerFormValues,
} from '../../../features/blob/blob-form-schema';
import { toApiError } from '../../../lib/errors';
import { useInvalidateAndBack } from '../../../lib/mutation-success';

/**
 * Form tạo container blob: chỉ có name (BlobContainerCreateDto).
 * Không có form sửa vì backend không có Update cho container.
 */
export default function BlobContainerFormScreen() {
  const { t } = useTranslation();
  const invalidateAndBack = useInvalidateAndBack(['blob-containers']);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const form = useForm<BlobContainerFormValues>({
    resolver: zodResolver(blobContainerFormSchema),
    defaultValues: blobContainerFormDefaults,
  });

  const mutation = useMutation({
    mutationFn: (values: BlobContainerFormValues) =>
      createBlobContainer({ name: values.name.trim() }),
    onSuccess: invalidateAndBack,
    onError: (error) => setSubmitError(toApiError(error).message),
  });

  return (
    <AppScreen scrollable title={t('blobContainers.createTitle')}>
      <VStack space="sm">
        <AppFormInput
          control={form.control}
          name="name"
          placeholder={t('blobContainers.namePlaceholder')}
          autoCapitalize="none"
          fieldError={(message) => (message ? t(message) : undefined)}
        />
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
