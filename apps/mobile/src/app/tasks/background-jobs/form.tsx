import { useState } from 'react';
import { View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Controller, useForm, type Control } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import { AppScreen } from '../../../components/ui/AppScreen';
import { AppSwitchField } from '../../../components/ui/AppSwitchField';
import { AppInput } from '../../../components/ui/AppInput';
import { AppFormSubmit } from '../../../components/ui/AppFormSubmit';
import { AppErrorState, AppLoading } from '../../../components/ui/AppStates';
import { VStack } from '@/components/ui/vstack';
import { Text } from '@/components/ui/text';
import {
  createBackgroundJob,
  getBackgroundJob,
  getBackgroundJobDefinitions,
  updateBackgroundJob,
} from '../../../features/tasks/tasks-api';
import {
  backgroundJobBaseFromForm,
  backgroundJobFormDefaults,
  backgroundJobFormSchema,
  type BackgroundJobFormValues,
} from '../../../features/tasks/task-form-schema';
import { toApiError } from '../../../lib/errors';

type TextFieldName =
  | 'name'
  | 'group'
  | 'type'
  | 'nodeName'
  | 'beginTime'
  | 'endTime'
  | 'jobType'
  | 'interval'
  | 'cron'
  | 'maxCount'
  | 'maxTryCount'
  | 'priority'
  | 'lockTimeOut'
  | 'description'
  | 'args';

function TextField({
  control,
  name,
  label,
  placeholder,
  keyboardType,
}: {
  control: Control<BackgroundJobFormValues>;
  name: TextFieldName;
  label: string;
  placeholder: string;
  keyboardType?: 'default' | 'numeric';
}) {
  const { t } = useTranslation();
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <View>
          <Text>{label}</Text>
          <AppInput
            value={field.value ?? ''}
            onChangeText={field.onChange}
            placeholder={placeholder}
            autoCapitalize="none"
            keyboardType={keyboardType}
          />
          {fieldState.error ? <Text>{t(fieldState.error.message as string)}</Text> : null}
        </View>
      )}
    />
  );
}

/**
 * Form tạo/sửa tác vụ nền, đúng DTO C#:
 * - Tạo: name/group/type/beginTime bắt buộc + nodeName/endTime tùy
 *   chọn + toàn bộ base; type nhập text kèm gợi ý definition từ GET
 *   .../definitions (drawer web dùng ApiSelect definition).
 * - Sửa: ẩn các field chỉ có ở CreateDto, hiển thị chỉ đọc
 *   (name/group/type/beginTime); chỉ gửi base + concurrencyStamp
 *   (UpdateDto) — không gửi name/group/type như các vòng trước.
 * - Số nhập text rồi parse ở schema (mẫu notification/ai); args là
 *   JSON object text, mặc định {}.
 */
export default function BackgroundJobFormScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const isEdit = Boolean(id);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const detail = useQuery({
    queryKey: ['tasks-background-jobs', id],
    queryFn: () => getBackgroundJob(id as string),
    enabled: isEdit,
  });
  const definitionsQuery = useQuery({
    queryKey: ['tasks-background-job-definitions'],
    queryFn: () => getBackgroundJobDefinitions(),
    enabled: !isEdit,
  });

  const form = useForm<BackgroundJobFormValues>({
    resolver: zodResolver(backgroundJobFormSchema(isEdit)),
    defaultValues: backgroundJobFormDefaults,
    values: detail.data
      ? {
          name: detail.data.name,
          group: detail.data.group,
          type: detail.data.type,
          nodeName: detail.data.nodeName ?? '',
          beginTime: detail.data.beginTime,
          endTime: detail.data.endTime ?? '',
          isEnabled: detail.data.isEnabled,
          description: detail.data.description ?? '',
          jobType: String(detail.data.jobType),
          cron: detail.data.cron ?? '',
          maxTryCount: String(detail.data.maxTryCount),
          maxCount: String(detail.data.maxCount),
          interval: String(detail.data.interval),
          priority: String(detail.data.priority),
          lockTimeOut: String(detail.data.lockTimeOut),
          args: JSON.stringify(detail.data.args ?? {}),
        }
      : undefined,
  });

  const mutation = useMutation({
    mutationFn: async (values: BackgroundJobFormValues) => {
      const base = backgroundJobBaseFromForm(values);
      if (isEdit) {
        return updateBackgroundJob(id as string, {
          ...base,
          concurrencyStamp: detail.data?.concurrencyStamp as string,
        });
      }
      return createBackgroundJob({
        ...base,
        name: (values.name as string).trim(),
        group: (values.group as string).trim(),
        type: (values.type as string).trim(),
        nodeName: values.nodeName?.trim() || undefined,
        beginTime: (values.beginTime as string).trim(),
        endTime: values.endTime?.trim() || undefined,
        source: 0,
      });
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['tasks-background-jobs'] });
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

  const definitionsHint =
    definitionsQuery.data?.items.map((d) => d.displayName ?? d.name).join(', ') ||
    t('backgroundJobs.typeHint');

  return (
    <AppScreen
      scrollable
      title={isEdit ? t('backgroundJobs.editTitle') : t('backgroundJobs.createTitle')}
    >
      <VStack space="sm">
        {isEdit && detail.data ? (
          <>
            <Text>
              {t('backgroundJobs.name')}: {detail.data.name}
            </Text>
            <Text>
              {t('backgroundJobs.group')}: {detail.data.group}
            </Text>
            <Text>
              {t('backgroundJobs.type')}: {detail.data.type}
            </Text>
            <Text>
              {t('backgroundJobs.beginTime')}: {detail.data.beginTime}
            </Text>
          </>
        ) : (
          <>
            <TextField
              control={form.control}
              name="name"
              label={t('backgroundJobs.name')}
              placeholder={t('backgroundJobs.namePlaceholder')}
            />
            <TextField
              control={form.control}
              name="group"
              label={t('backgroundJobs.group')}
              placeholder={t('backgroundJobs.groupPlaceholder')}
            />
            <TextField
              control={form.control}
              name="type"
              label={t('backgroundJobs.type')}
              placeholder={t('backgroundJobs.typePlaceholder')}
            />
            <Text>
              {t('backgroundJobs.typeHint')}: {definitionsHint}
            </Text>
            <TextField
              control={form.control}
              name="nodeName"
              label={t('backgroundJobs.nodeName')}
              placeholder={t('backgroundJobs.nodeNamePlaceholder')}
            />
            <TextField
              control={form.control}
              name="beginTime"
              label={t('backgroundJobs.beginTime')}
              placeholder={t('backgroundJobs.beginTimePlaceholder')}
            />
            <TextField
              control={form.control}
              name="endTime"
              label={t('backgroundJobs.endTime')}
              placeholder={t('backgroundJobs.endTimePlaceholder')}
            />
          </>
        )}
        <Controller
          control={form.control}
          name="isEnabled"
          render={({ field }) => (
            <AppSwitchField
              label={t('backgroundJobs.isEnabled')}
              value={field.value}
              onValueChange={field.onChange}
              layout="stack"
            />
          )}
        />
        <TextField
          control={form.control}
          name="jobType"
          label={t('backgroundJobs.jobType')}
          placeholder={t('backgroundJobs.jobTypeHint')}
          keyboardType="numeric"
        />
        <TextField
          control={form.control}
          name="interval"
          label={t('backgroundJobs.interval')}
          placeholder={t('backgroundJobs.intervalPlaceholder')}
          keyboardType="numeric"
        />
        <TextField
          control={form.control}
          name="cron"
          label={t('backgroundJobs.cron')}
          placeholder={t('backgroundJobs.cronPlaceholder')}
        />
        <TextField
          control={form.control}
          name="maxCount"
          label={t('backgroundJobs.maxCount')}
          placeholder="0"
          keyboardType="numeric"
        />
        <TextField
          control={form.control}
          name="maxTryCount"
          label={t('backgroundJobs.maxTryCount')}
          placeholder="50"
          keyboardType="numeric"
        />
        <TextField
          control={form.control}
          name="priority"
          label={t('backgroundJobs.priority')}
          placeholder={t('backgroundJobs.priorityHint')}
          keyboardType="numeric"
        />
        <TextField
          control={form.control}
          name="lockTimeOut"
          label={t('backgroundJobs.lockTimeOut')}
          placeholder="0"
          keyboardType="numeric"
        />
        <TextField
          control={form.control}
          name="description"
          label={t('backgroundJobs.description')}
          placeholder={t('backgroundJobs.descriptionPlaceholder')}
        />
        <TextField
          control={form.control}
          name="args"
          label={t('backgroundJobs.args')}
          placeholder={t('backgroundJobs.argsPlaceholder')}
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
