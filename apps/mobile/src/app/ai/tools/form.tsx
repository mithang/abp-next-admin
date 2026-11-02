import { useState } from 'react';
import { Switch, View } from 'react-native';
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
  const router = useRouter();
  const queryClient = useQueryClient();
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
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['ai-tools'] });
      router.back();
    },
    onError: (error) => setSubmitError(toApiError(error).message),
  });

  if (isEdit && detail.isPending) return <AppLoading />;
  if (isEdit && detail.isError) {
    return (
      <AppErrorState
        message={toApiError(detail.error).message}
        onRetry={() => void detail.refetch()}
      />
    );
  }

  const fieldError = (message?: string) =>
    message && message.startsWith('aiTools.') ? t(message) : message;

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
          <Controller
            control={form.control}
            name="name"
            render={({ field, fieldState }) => (
              <AppInput
                label={t('aiTools.name')}
                value={field.value ?? ''}
                onChangeText={field.onChange}
                placeholder={t('aiTools.namePlaceholder')}
                autoCapitalize="none"
                error={fieldError(fieldState.error?.message)}
              />
            )}
          />
        ) : null}
        <Controller
          control={form.control}
          name="provider"
          render={({ field, fieldState }) => (
            <AppInput
              label={t('aiTools.provider')}
              value={field.value}
              onChangeText={(text) => {
                field.onChange(text);
                setProviderText(text);
              }}
              placeholder={t('aiTools.providerPlaceholder')}
              autoCapitalize="none"
              error={fieldError(fieldState.error?.message)}
            />
          )}
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
        <Controller
          control={form.control}
          name="description"
          render={({ field, fieldState }) => (
            <AppInput
              label={t('aiTools.description')}
              value={field.value ?? ''}
              onChangeText={field.onChange}
              placeholder={t('aiTools.descriptionPlaceholder')}
              multiline
              error={fieldError(fieldState.error?.message)}
            />
          )}
        />
        <Controller
          control={form.control}
          name="isEnabled"
          render={({ field }) => (
            <View>
              <Text>{t('aiTools.enabled')}</Text>
              <Switch
                value={field.value}
                onValueChange={field.onChange}
                accessibilityRole="switch"
              />
            </View>
          )}
        />
        <Controller
          control={form.control}
          name="isGlobal"
          render={({ field }) => (
            <View>
              <Text>{t('aiTools.global')}</Text>
              <Switch
                value={field.value}
                onValueChange={field.onChange}
                accessibilityRole="switch"
              />
            </View>
          )}
        />
        <Controller
          control={form.control}
          name="stateCheckers"
          render={({ field, fieldState }) => (
            <AppInput
              label={t('aiTools.stateCheckers')}
              value={field.value ?? ''}
              onChangeText={field.onChange}
              placeholder={t('aiTools.stateCheckersPlaceholder')}
              autoCapitalize="none"
              error={fieldError(fieldState.error?.message)}
            />
          )}
        />
        <Controller
          control={form.control}
          name="extraPropertiesJson"
          render={({ field, fieldState }) => (
            <AppInput
              label={t('aiTools.extraProperties')}
              value={field.value ?? ''}
              onChangeText={field.onChange}
              placeholder={t('aiTools.extraPropertiesPlaceholder')}
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
