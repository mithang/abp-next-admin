import { useState } from 'react';
import { useLocalSearchParams } from 'expo-router';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import { AppScreen } from '../../../components/ui/AppScreen';
import { AppFormSwitch } from '../../../components/ui/AppFormSwitch';
import { AppFormInput } from '../../../components/ui/AppFormInput';
import { AppFormSubmit } from '../../../components/ui/AppFormSubmit';
import { VStack } from '@/components/ui/vstack';
import { Text } from '@/components/ui/text';
import {
  createAITool,
  getAITool,
  getAIToolProviders,
  updateAITool,
} from '../../../features/ai/ai-api';
import {
  aiToolFormDefaults,
  aiToolFormSchema,
  parseExtraPropertiesJson,
  type AIToolFormValues,
} from '../../../features/ai/ai-tool-form-schema';
import { toApiError } from '../../../lib/errors';
import { queryStateElement } from '../../../lib/query-state';
import { createFieldError } from '../../../lib/field-error';
import { useInvalidateAndBack } from '../../../lib/mutation-success';

/**
 * Form tạo/sửa công cụ AI. Tạo nhập name; sửa không đổi name (khóa định
 * danh) và gửi kèm concurrencyStamp lấy từ detail (UpdateDto bắt buộc).
 * Provider nhập text; danh sách provider khả dụng load từ
 * GET .../tools/available-providers hiển thị làm gợi ý kèm tên các thuộc
 * tính động của provider đã chọn (web render các thuộc tính này thành
 * field riêng; mobile gom vào extraProperties JSON có kiểm chứng).
 */
export default function AIToolFormScreen() {
  const { t } = useTranslation();
  const invalidateAndBack = useInvalidateAndBack(['ai-tools']);
  const { id } = useLocalSearchParams<{ id?: string }>();
  const isEdit = Boolean(id);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [providerText, setProviderText] = useState('');

  const detail = useQuery({
    queryKey: ['ai-tools', id],
    queryFn: () => getAITool(id as string),
    enabled: isEdit,
  });
  const providersQuery = useQuery({
    queryKey: ['ai-tool-providers'],
    queryFn: () => getAIToolProviders(),
  });

  const form = useForm<AIToolFormValues>({
    resolver: zodResolver(aiToolFormSchema),
    defaultValues: aiToolFormDefaults,
    values: detail.data
      ? {
          name: detail.data.name,
          provider: detail.data.provider,
          description: detail.data.description ?? '',
          isEnabled: detail.data.isEnabled,
          isGlobal: detail.data.isGlobal,
          stateCheckers: detail.data.stateCheckers ?? '',
          extraPropertiesJson:
            detail.data.extraProperties && Object.keys(detail.data.extraProperties).length > 0
              ? JSON.stringify(detail.data.extraProperties)
              : '',
        }
      : undefined,
  });

  const mutation = useMutation({
    mutationFn: async (values: AIToolFormValues) => {
      const shared = {
        provider: values.provider.trim(),
        description: values.description?.trim() || undefined,
        isEnabled: values.isEnabled,
        isGlobal: values.isGlobal,
        stateCheckers: values.stateCheckers?.trim() || undefined,
        extraProperties: parseExtraPropertiesJson(values),
      };
      if (isEdit) {
        return updateAITool(id as string, {
          ...shared,
          concurrencyStamp: detail.data?.concurrencyStamp ?? '',
        });
      }
      return createAITool({ ...shared, name: (values.name ?? '').trim() });
    },
    onSuccess: invalidateAndBack,
    onError: (error) => setSubmitError(toApiError(error).message),
  });

  const queryState = queryStateElement(detail);
  if (isEdit && queryState) return queryState;

  const fieldError = createFieldError(t, 'aiTools');

  const effectiveProvider = providerText || detail.data?.provider || '';
  const selectedProvider = providersQuery.data?.items.find(
    (p) => p.name === effectiveProvider.trim(),
  );
  const providerHint =
    providersQuery.data?.items.map((p) => p.name).join(', ') || t('aiTools.providersLoading');

  return (
    <AppScreen scrollable title={t(isEdit ? 'aiTools.editTitle' : 'aiTools.createTitle')}>
      <VStack space="sm">
        {!isEdit ? (
          <AppFormInput
            control={form.control}
            name="name"
            label={t('aiTools.name')}
            placeholder={t('aiTools.namePlaceholder')}
            autoCapitalize="none"
            fieldError={fieldError}
          />
        ) : null}
        <AppFormInput
          control={form.control}
          name="provider"
          label={t('aiTools.provider')}
          placeholder={t('aiTools.providerPlaceholder')}
          autoCapitalize="none"
          fieldError={fieldError}
          onChangeExtra={setProviderText}
        />
        <Text>
          {t('aiTools.providersHint')}: {providerHint}
        </Text>
        {selectedProvider && selectedProvider.properties.length > 0 ? (
          <Text>
            {t('aiTools.providerProperties')}:{' '}
            {selectedProvider.properties.map((p) => p.displayName || p.name).join(', ')}
          </Text>
        ) : null}
        <AppFormInput
          control={form.control}
          name="description"
          label={t('aiTools.description')}
          placeholder={t('aiTools.descriptionPlaceholder')}
          multiline
          fieldError={fieldError}
        />
        <AppFormSwitch
          control={form.control}
          name="isEnabled"
          label={t('aiTools.enabled')}
          layout="stack"
        />
        <AppFormSwitch
          control={form.control}
          name="isGlobal"
          label={t('aiTools.global')}
          layout="stack"
        />
        <AppFormInput
          control={form.control}
          name="stateCheckers"
          label={t('aiTools.stateCheckers')}
          placeholder={t('aiTools.stateCheckersPlaceholder')}
          autoCapitalize="none"
          fieldError={fieldError}
        />
        <AppFormInput
          control={form.control}
          name="extraPropertiesJson"
          label={t('aiTools.extraProperties')}
          placeholder={t('aiTools.extraPropertiesPlaceholder')}
          autoCapitalize="none"
          multiline
          fieldError={fieldError}
        />
        <AppFormSubmit
          error={submitError}
          title={t('common.save')}
          loading={mutation.isPending}
          disabled={mutation.isPending}
          onPress={() => void form.handleSubmit((values) => mutation.mutate(values))()}
        />
      </VStack>
    </AppScreen>
  );
}
