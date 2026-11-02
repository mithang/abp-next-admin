import { useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import { AppScreen } from '../../../components/ui/AppScreen';
import { AppInput } from '../../../components/ui/AppInput';
import { AppButton } from '../../../components/ui/AppButton';
import { VStack } from '@/components/ui/vstack';
import { Text } from '@/components/ui/text';
import { createBlobFolder } from '../../../features/blob/blob-api';
import {
  blobFolderFormDefaults,
  blobFolderFormSchema,
  type BlobFolderFormValues,
} from '../../../features/blob/blob-form-schema';
import { toApiError } from '../../../lib/errors';

/**
 * Form tạo thư mục: containerId + parentId preset từ query (đúng nút
 * tạo thư mục của bảng web); chỉ nhập name (BlobFolderCreateDto).
 */
export default function BlobFolderFormScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { containerId, parentId } = useLocalSearchParams<{
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
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['blob-blobs'] });
      router.back();
    },
    onError: (error) => setSubmitError(toApiError(error).message),
  });

  return (
    <AppScreen title={t('blobBlobs.createFolderTitle')}>
      <VStack space="sm">
        <Controller
          control={form.control}
          name="name"
          render={({ field, fieldState }) => (
            <>
              <AppInput
                value={field.value}
                onChangeText={field.onChange}
                placeholder={t('blobBlobs.folderNamePlaceholder')}
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
