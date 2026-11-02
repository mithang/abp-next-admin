import { useState } from 'react';
import { Pressable, Switch, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import { AppScreen } from '../../components/ui/AppScreen';
import { AppInput } from '../../components/ui/AppInput';
import { AppButton } from '../../components/ui/AppButton';
import { AppErrorState, AppLoading } from '../../components/ui/AppStates';
import { VStack } from '@/components/ui/vstack';
import { Text } from '@/components/ui/text';
import {
  createClaimType,
  getClaimType,
  updateClaimType,
} from '../../features/identity/claim-types-api';
import { ValueType, valueTypeKey } from '../../features/identity/claim-types';
import {
  claimTypeFormDefaults,
  claimTypeFormSchema,
  toClaimTypeCreateInput,
  toClaimTypeUpdateInput,
  type ClaimTypeFormValues,
} from '../../features/identity/claim-type-form-schema';
import { toApiError } from '../../lib/errors';

const VALUE_TYPE_OPTIONS = [ValueType.String, ValueType.Int, ValueType.Boolean, ValueType.DateTime];

/**
 * Form tạo/sửa loại claim: route /claim-types/form (tạo) hoặc
 * /claim-types/form?id=<id> (sửa), theo đúng pattern /roles/form để tránh
 * xung đột file [id].tsx trong Expo Router. Sửa chỉ gửi 4 field update;
 * loại claim tĩnh không vào được form này (detail ẩn nút Sửa, giống web).
 */
export default function ClaimTypeFormScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const isEdit = Boolean(id);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const detail = useQuery({
    queryKey: ['claim-types', id],
    queryFn: () => getClaimType(id as string),
    enabled: isEdit,
  });

  const form = useForm<ClaimTypeFormValues>({
    resolver: zodResolver(claimTypeFormSchema),
    defaultValues: claimTypeFormDefaults,
    values: detail.data
      ? {
          name: detail.data.name,
          valueType: detail.data.valueType,
          required: detail.data.required,
          description: detail.data.description,
          regex: detail.data.regex,
          regexDescription: detail.data.regexDescription,
        }
      : undefined,
  });

  const mutation = useMutation({
    mutationFn: async (values: ClaimTypeFormValues) => {
      if (isEdit) {
        return updateClaimType(id as string, toClaimTypeUpdateInput(values));
      }
      return createClaimType(toClaimTypeCreateInput(values));
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['claim-types'] });
      router.back();
    },
    onError: (error: unknown) => setSubmitError(toApiError(error).message),
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
  // Loại tĩnh không sửa được (giống web ẩn nút xác nhận): chặn ở form thay vì để API từ chối.
  if (isEdit && detail.data?.isStatic) {
    return (
      <AppErrorState message={t('claimTypes.staticCannotEdit')} onRetry={() => router.back()} />
    );
  }

  const fieldError = (key?: string) => (key && key.startsWith('claimTypes.') ? t(key) : key);

  return (
    <AppScreen title={isEdit ? t('claimTypes.editTitle') : t('claimTypes.createTitle')}>
      <VStack space="md">
        {isEdit ? (
          <>
            <Text>
              {t('claimTypes.name')}: {detail.data?.name}
            </Text>
            <Text>
              {t('claimTypes.valueTypeLabel')}:{' '}
              {detail.data ? t(`claimTypes.valueType.${valueTypeKey(detail.data.valueType)}`) : ''}
            </Text>
          </>
        ) : (
          <>
            <Controller
              control={form.control}
              name="name"
              render={({ field, fieldState }) => (
                <AppInput
                  label={t('claimTypes.name')}
                  value={field.value}
                  onChangeText={field.onChange}
                  placeholder={t('claimTypes.namePlaceholder')}
                  autoCapitalize="none"
                  error={fieldError(fieldState.error?.message)}
                  testID="claim-type-name"
                />
              )}
            />
            <Controller
              control={form.control}
              name="valueType"
              render={({ field }) => (
                <View>
                  <Text>{t('claimTypes.valueTypeLabel')}</Text>
                  <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 8 }}>
                    {VALUE_TYPE_OPTIONS.map((option) => {
                      const selected = field.value === option;
                      return (
                        <Pressable
                          key={option}
                          onPress={() => field.onChange(option)}
                          accessibilityRole="button"
                          accessibilityState={{ selected }}
                          testID={`claim-type-value-${valueTypeKey(option)}`}
                          style={{
                            paddingHorizontal: 12,
                            paddingVertical: 8,
                            borderRadius: 999,
                            borderWidth: 1,
                            borderColor: selected ? '#2563eb' : '#cbd5e1',
                            backgroundColor: selected ? '#dbeafe' : 'transparent',
                          }}
                        >
                          <Text>{t(`claimTypes.valueType.${valueTypeKey(option)}`)}</Text>
                        </Pressable>
                      );
                    })}
                  </View>
                </View>
              )}
            />
          </>
        )}
        <Controller
          control={form.control}
          name="required"
          render={({ field }) => (
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <Text>{t('claimTypes.required')}</Text>
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
          name="regex"
          render={({ field }) => (
            <AppInput
              label={t('claimTypes.regex')}
              value={field.value ?? ''}
              onChangeText={field.onChange}
              placeholder={t('claimTypes.regexPlaceholder')}
              autoCapitalize="none"
              testID="claim-type-regex"
            />
          )}
        />
        <Controller
          control={form.control}
          name="regexDescription"
          render={({ field }) => (
            <AppInput
              label={t('claimTypes.regexDescription')}
              value={field.value ?? ''}
              onChangeText={field.onChange}
              placeholder={t('claimTypes.regexDescriptionPlaceholder')}
              testID="claim-type-regex-description"
            />
          )}
        />
        <Controller
          control={form.control}
          name="description"
          render={({ field }) => (
            <AppInput
              label={t('claimTypes.description')}
              value={field.value ?? ''}
              onChangeText={field.onChange}
              placeholder={t('claimTypes.descriptionPlaceholder')}
              multiline
              testID="claim-type-description"
            />
          )}
        />
        {submitError ? <Text>{submitError}</Text> : null}
        <AppButton
          title={isEdit ? t('common.save') : t('common.create')}
          onPress={form.handleSubmit((values) => {
            setSubmitError(null);
            mutation.mutate(values);
          })}
          loading={mutation.isPending}
          testID="claim-type-submit"
        />
      </VStack>
    </AppScreen>
  );
}
