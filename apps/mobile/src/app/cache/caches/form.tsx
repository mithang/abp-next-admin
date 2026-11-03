import { useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import { AppScreen } from '../../../components/ui/AppScreen';
import { AppFormInput } from '../../../components/ui/AppFormInput';
import { AppButton } from '../../../components/ui/AppButton';
import { VStack } from '@/components/ui/vstack';
import { setCacheValue } from '../../../features/caching/caching-api';
import {
  cacheSetFormDefaults,
  cacheSetFormSchema,
  toCacheSetExpirations,
  type CacheSetFormValues,
} from '../../../features/caching/cache-set-form-schema';
import { toApiError } from '../../../lib/errors';
import { stateErrorElement } from '../../../lib/state-error';
import { createFieldError } from '../../../lib/field-error';

/**
 * Form đặt giá trị cache: PUT /api/caching-management/cache/set.
 * Mở từ danh sách (trống) hoặc từ chi tiết (prefill key qua query param).
 * Hạn nhập text ISO, đổi sang ISO ở submit; rỗng = không đặt hạn.
 */
export default function CacheSetFormScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { key } = useLocalSearchParams<{ key?: string }>();
  const [submitError, setSubmitError] = useState<string | null>(null);

  const form = useForm<CacheSetFormValues>({
    resolver: zodResolver(cacheSetFormSchema),
    defaultValues: cacheSetFormDefaults,
    values: key ? { ...cacheSetFormDefaults, key: key as string } : undefined,
  });

  const mutation = useMutation({
    mutationFn: async (values: CacheSetFormValues) => {
      return setCacheValue({
        key: values.key,
        value: values.value || undefined,
        ...toCacheSetExpirations(values),
      });
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['cache-keys'] });
      await queryClient.invalidateQueries({ queryKey: ['cache-values'] });
      router.back();
    },
    onError: (error: unknown) => setSubmitError(toApiError(error).message),
  });

  const fieldError = createFieldError(t, 'caches');

  return (
    <AppScreen scrollable title={t('caches.setTitle')}>
      <VStack space="md">
        <AppFormInput
          control={form.control}
          name="key"
          label={t('caches.key')}
          placeholder={t('caches.keyPlaceholder')}
          autoCapitalize="none"
          testID="cache-set-key"
          fieldError={fieldError}
        />
        <AppFormInput
          control={form.control}
          name="value"
          label={t('caches.value')}
          placeholder={t('caches.valuePlaceholder')}
          multiline
          testID="cache-set-value"
          fieldError={fieldError}
        />
        <AppFormInput
          control={form.control}
          name="absoluteExpiration"
          label={t('caches.absoluteExpiration')}
          placeholder={t('caches.dateTimePlaceholder')}
          autoCapitalize="none"
          testID="cache-set-absolute-expiration"
          fieldError={fieldError}
        />
        <AppFormInput
          control={form.control}
          name="slidingExpiration"
          label={t('caches.slidingExpiration')}
          placeholder={t('caches.dateTimePlaceholder')}
          autoCapitalize="none"
          testID="cache-set-sliding-expiration"
          fieldError={fieldError}
        />
        <AppButton
          title={t('common.save')}
          loading={mutation.isPending}
          onPress={() => void form.handleSubmit((values) => mutation.mutate(values))()}
        />
        {stateErrorElement(submitError)}
      </VStack>
    </AppScreen>
  );
}
