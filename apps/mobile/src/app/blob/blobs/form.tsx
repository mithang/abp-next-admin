import { useState } from 'react';
import { useRouteParams } from '../../../lib/route-params';
import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import { AppScreen } from '../../../components/ui/AppScreen';
import { AppFormInput } from '../../../components/ui/AppFormInput';
import { AppFormSubmit } from '../../../components/ui/AppFormSubmit';
import { VStack } from '@/components/ui/vstack';
import { createBlobFolder } from '../../../features/blob/blob-api';
import {
  blobFolderFormDefaults,
  blobFolderFormSchema,
  type BlobFolderFormValues,
} from '../../../features/blob/blob-form-schema';
import { toApiError } from '../../../lib/errors';
import { useInvalidateAndBack } from '../../../lib/mutation-success';

/**
 * Form tạo thư mục: containerId + parentId preset từ query (đúng nút
 * tạo thư mục của bảng web); chỉ nhập name (BlobFolderCreateDto).
 */
export default function BlobFolderFormScreen() {
  const { t } = useTranslation();
  const invalidateAndBack = useInvalidateAndBack(['blob-blobs']);
  const { containerId, parentId } = useRouteParams<{
    containerId: string;
    parentId?: string;
  }>();
  const [submitError, setSubmitError] = useState<string | null>(null);

  const form = useForm<BlobFolderFormValues>({
    resolver: zodResolver(blobFolderFormSchema),
    defaultValues: blobFolderFormDefaults,
  });

  const mutation = useMutation({
    mutationFn: (values: BlobFolderFormValues) =>
      createBlobFolder({
        containerId: containerId as string,
        name: values.name.trim(),
        parentId: parentId || undefined,
      }),
    onSuccess: invalidateAndBack,
    onError: (error) => setSubmitError(toApiError(error).message),
  });

  return (
    <AppScreen scrollable title={t('blobBlobs.createFolderTitle')}>
      <VStack space="sm">
        <AppFormInput
          control={form.control}
          name="name"
          placeholder={t('blobBlobs.folderNamePlaceholder')}
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
