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
  createWorkspace,
  getAIToolsPaged,
  getWorkspace,
  getWorkspaceProviders,
  updateWorkspace,
} from '../../../features/ai/ai-api';
import {
  aiWorkspaceFormDefaults,
  aiWorkspaceFormSchema,
  aiWorkspaceResetApiKeySchema,
  toWorkspaceNumericFields,
  type AIWorkspaceFormValues,
  type AIWorkspaceResetApiKeyValues,
} from '../../../features/ai/ai-workspace-form-schema';
import { toApiError } from '../../../lib/errors';

/**
 * Form tạo/sửa không gian làm việc + chế độ đặt lại API key (?reset=1).
 * - Tạo: nhập name; sửa: name không đổi, gửi kèm concurrencyStamp.
 * - Sửa để trống apiKey = giữ key cũ (backend chỉ ghi đè khi apiKey
 *   không rỗng); chế độ reset chỉ có field apiKey bắt buộc và PUT toàn
 *   bộ DTO hiện tại + apiKey mới — đúng modal ResetApiKey của web.
 * - Provider/model: danh sách provider khả dụng load từ
 *   GET .../workspaces/available-providers hiển thị làm gợi ý (model của
 *   provider đã chọn liệt kê kèm); tools nhập mỗi dòng một tên, gợi ý
 *   lấy từ các công cụ đang bật (web load tools isEnabled=true).
 */
export default function AIWorkspaceFormScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { id, reset } = useLocalSearchParams<{ id?: string; reset?: string }>();
  const isEdit = Boolean(id);
  const isReset = reset === '1' && isEdit;
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [providerText, setProviderText] = useState('');

  const detail = useQuery({
    queryKey: ['ai-workspaces', id],
    queryFn: () => getWorkspace(id as string),
    enabled: isEdit,
  });
  const providersQuery = useQuery({
    queryKey: ['ai-workspace-providers'],
    queryFn: () => getWorkspaceProviders(),
  });
  const toolsQuery = useQuery({
    queryKey: ['ai-tools-enabled'],
    queryFn: () => getAIToolsPaged({ isEnabled: true, maxResultCount: 50 }),
  });

  const form = useForm<AIWorkspaceFormValues>({
    resolver: zodResolver(aiWorkspaceFormSchema),
    defaultValues: aiWorkspaceFormDefaults,
    values: detail.data
      ? {
          name: detail.data.name,
          provider: detail.data.provider,
          modelName: detail.data.modelName,
          displayName: detail.data.displayName,
          description: detail.data.description ?? '',
          apiKey: '',
          apiBaseUrl: detail.data.apiBaseUrl ?? '',
          systemPrompt: detail.data.systemPrompt ?? '',
          instructions: detail.data.instructions ?? '',
          temperature:
            detail.data.temperature === undefined || detail.data.temperature === null
              ? ''
              : String(detail.data.temperature),
          maxOutputTokens:
            detail.data.maxOutputTokens === undefined || detail.data.maxOutputTokens === null
              ? ''
              : String(detail.data.maxOutputTokens),
          frequencyPenalty:
            detail.data.frequencyPenalty === undefined || detail.data.frequencyPenalty === null
              ? ''
              : String(detail.data.frequencyPenalty),
          presencePenalty:
            detail.data.presencePenalty === undefined || detail.data.presencePenalty === null
              ? ''
              : String(detail.data.presencePenalty),
          isEnabled: detail.data.isEnabled,
          tools: (detail.data.tools ?? []).join('\n'),
          stateCheckers: detail.data.stateCheckers ?? '',
        }
      : undefined,
  });

  const resetForm = useForm<AIWorkspaceResetApiKeyValues>({
    resolver: zodResolver(aiWorkspaceResetApiKeySchema),
    defaultValues: { apiKey: '' },
  });

  const fieldError = (message?: string) =>
    message && message.startsWith('aiWorkspaces.') ? t(message) : message;

  const mutation = useMutation({
    mutationFn: async (values: AIWorkspaceFormValues) => {
      const numeric = toWorkspaceNumericFields(values);
      const shared = {
        provider: values.provider.trim(),
        modelName: values.modelName.trim(),
        displayName: values.displayName.trim(),
        description: values.description?.trim() || undefined,
        apiBaseUrl: values.apiBaseUrl?.trim() || undefined,
        systemPrompt: values.systemPrompt?.trim() || undefined,
        instructions: values.instructions?.trim() || undefined,
        isEnabled: values.isEnabled,
        stateCheckers: values.stateCheckers?.trim() || undefined,
        ...numeric,
      };
      if (isEdit) {
        return updateWorkspace(id as string, {
          ...shared,
          apiKey: values.apiKey?.trim() || undefined,
          concurrencyStamp: detail.data?.concurrencyStamp ?? '',
        });
      }
      return createWorkspace({
        ...shared,
        name: (values.name ?? '').trim(),
        apiKey: values.apiKey?.trim() || undefined,
      });
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['ai-workspaces'] });
      router.back();
    },
    onError: (error) => setSubmitError(toApiError(error).message),
  });

  const resetMutation = useMutation({
    mutationFn: async (values: AIWorkspaceResetApiKeyValues) => {
      const d = detail.data;
      if (!d) throw new Error(t('common.empty'));
      return updateWorkspace(id as string, {
        provider: d.provider,
        modelName: d.modelName,
        displayName: d.displayName,
        description: d.description ?? undefined,
        apiKey: values.apiKey.trim(),
        apiBaseUrl: d.apiBaseUrl ?? undefined,
        systemPrompt: d.systemPrompt ?? undefined,
        instructions: d.instructions ?? undefined,
        temperature: d.temperature ?? undefined,
        maxOutputTokens: d.maxOutputTokens ?? undefined,
        frequencyPenalty: d.frequencyPenalty ?? undefined,
        presencePenalty: d.presencePenalty ?? undefined,
        isEnabled: d.isEnabled,
        tools: d.tools ?? undefined,
        stateCheckers: d.stateCheckers ?? undefined,
        concurrencyStamp: d.concurrencyStamp,
      });
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['ai-workspaces'] });
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

  if (isReset) {
    return (
      <AppScreen title={t('aiWorkspaces.resetApiKey')}>
        <VStack space="sm">
          <Text>{t('aiWorkspaces.resetApiKeyHint')}</Text>
          <Controller
            control={resetForm.control}
            name="apiKey"
            render={({ field, fieldState }) => (
              <AppInput
                label={t('aiWorkspaces.apiKey')}
                value={field.value}
                onChangeText={field.onChange}
                placeholder={t('aiWorkspaces.apiKeyPlaceholder')}
                autoCapitalize="none"
                secureTextEntry
                error={fieldError(fieldState.error?.message)}
              />
            )}
          />
          {submitError ? <Text>{submitError}</Text> : null}
          <AppButton
            title={t('common.save')}
            loading={resetMutation.isPending}
            disabled={resetMutation.isPending}
            onPress={() => void resetForm.handleSubmit((values) => resetMutation.mutate(values))()}
          />
        </VStack>
      </AppScreen>
    );
  }

  const effectiveProvider = providerText || detail.data?.provider || '';
  const selectedProvider = providersQuery.data?.items.find(
    (p) => p.name === effectiveProvider.trim(),
  );
  const providerHint =
    providersQuery.data?.items.map((p) => p.name).join(', ') || t('aiWorkspaces.providersLoading');
  const enabledToolNames = toolsQuery.data?.items.map((item) => item.name).join(', ') ?? '';

  const textField = (
    name: keyof AIWorkspaceFormValues,
    labelKey: string,
    placeholderKey: string,
    opts: { multiline?: boolean; secure?: boolean; numeric?: boolean } = {},
  ) => (
    <Controller
      control={form.control}
      name={name}
      render={({ field, fieldState }) => (
        <AppInput
          label={t(labelKey)}
          value={(field.value as string) ?? ''}
          onChangeText={(text) => {
            field.onChange(text);
            if (name === 'provider') setProviderText(text);
          }}
          placeholder={t(placeholderKey)}
          autoCapitalize="none"
          multiline={opts.multiline}
          secureTextEntry={opts.secure}
          keyboardType={opts.numeric ? 'numeric' : 'default'}
          error={fieldError(fieldState.error?.message)}
        />
      )}
    />
  );

  return (
    <AppScreen title={t(isEdit ? 'aiWorkspaces.editTitle' : 'aiWorkspaces.createTitle')}>
      <VStack space="sm">
        {!isEdit ? textField('name', 'aiWorkspaces.name', 'aiWorkspaces.namePlaceholder') : null}
        {textField(
          'displayName',
          'aiWorkspaces.displayName',
          'aiWorkspaces.displayNamePlaceholder',
        )}
        {textField('provider', 'aiWorkspaces.provider', 'aiWorkspaces.providerPlaceholder')}
        <Text>
          {t('aiWorkspaces.providersHint')}: {providerHint}
        </Text>
        {selectedProvider && selectedProvider.models.length > 0 ? (
          <Text>
            {t('aiWorkspaces.modelsHint')}: {selectedProvider.models.join(', ')}
          </Text>
        ) : null}
        {textField('modelName', 'aiWorkspaces.modelName', 'aiWorkspaces.modelNamePlaceholder')}
        {textField(
          'description',
          'aiWorkspaces.description',
          'aiWorkspaces.descriptionPlaceholder',
          { multiline: true },
        )}
        {textField('apiBaseUrl', 'aiWorkspaces.apiBaseUrl', 'aiWorkspaces.apiBaseUrlPlaceholder')}
        {textField(
          'apiKey',
          'aiWorkspaces.apiKey',
          isEdit ? 'aiWorkspaces.apiKeyEditPlaceholder' : 'aiWorkspaces.apiKeyPlaceholder',
          {
            secure: true,
          },
        )}
        {textField(
          'systemPrompt',
          'aiWorkspaces.systemPrompt',
          'aiWorkspaces.systemPromptPlaceholder',
          { multiline: true },
        )}
        {textField(
          'instructions',
          'aiWorkspaces.instructions',
          'aiWorkspaces.instructionsPlaceholder',
          { multiline: true },
        )}
        {textField(
          'temperature',
          'aiWorkspaces.temperature',
          'aiWorkspaces.temperaturePlaceholder',
          { numeric: true },
        )}
        {textField(
          'maxOutputTokens',
          'aiWorkspaces.maxOutputTokens',
          'aiWorkspaces.maxOutputTokensPlaceholder',
          { numeric: true },
        )}
        {textField(
          'frequencyPenalty',
          'aiWorkspaces.frequencyPenalty',
          'aiWorkspaces.frequencyPenaltyPlaceholder',
          { numeric: true },
        )}
        {textField(
          'presencePenalty',
          'aiWorkspaces.presencePenalty',
          'aiWorkspaces.presencePenaltyPlaceholder',
          { numeric: true },
        )}
        <Controller
          control={form.control}
          name="isEnabled"
          render={({ field }) => (
            <View>
              <Text>{t('aiWorkspaces.enabled')}</Text>
              <Switch
                value={field.value}
                onValueChange={field.onChange}
                accessibilityRole="switch"
              />
            </View>
          )}
        />
        {textField('tools', 'aiWorkspaces.tools', 'aiWorkspaces.toolsPlaceholder', {
          multiline: true,
        })}
        {enabledToolNames ? (
          <Text>
            {t('aiWorkspaces.enabledToolsHint')}: {enabledToolNames}
          </Text>
        ) : null}
        {textField(
          'stateCheckers',
          'aiWorkspaces.stateCheckers',
          'aiWorkspaces.stateCheckersPlaceholder',
        )}
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
