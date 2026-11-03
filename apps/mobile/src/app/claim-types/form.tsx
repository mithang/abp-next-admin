import { useState } from 'react';
import { Pressable, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import { AppScreen } from '../../components/ui/AppScreen';
import { AppFormSwitch } from '../../components/ui/AppFormSwitch';
import { AppFormInput } from '../../components/ui/AppFormInput';
import { AppFormSubmit } from '../../components/ui/AppFormSubmit';
import { AppErrorState } from '../../components/ui/AppStates';
import { queryStateElement } from '../../lib/query-state';
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
import { createFieldError } from '../../lib/field-error';
import { useInvalidateAndBack } from '../../lib/mutation-success';

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
  const invalidateAndBack = useInvalidateAndBack(['claim-types']);
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
    onSuccess: invalidateAndBack,
    onError: (error: unknown) => setSubmitError(toApiError(error).message),
  });

  const queryState = queryStateElement(detail);
  if (isEdit && queryState) return queryState;
  // Loại tĩnh không sửa được (giống web ẩn nút xác nhận): chặn ở form thay vì để API từ chối.
  if (isEdit && detail.data?.isStatic) {
    return (
      <AppErrorState message={t('claimTypes.staticCannotEdit')} onRetry={() => router.back()} />
    );
  }

  const fieldError = createFieldError(t, 'claimTypes');

  return (
    <AppScreen scrollable title={isEdit ? t('claimTypes.editTitle') : t('claimTypes.createTitle')}>
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
            <AppFormInput
              control={form.control}
              name="name"
              label={t('claimTypes.name')}
              placeholder={t('claimTypes.namePlaceholder')}
              autoCapitalize="none"
              testID="claim-type-name"
              fieldError={fieldError}
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
        <AppFormSwitch control={form.control} name="required" label={t('claimTypes.required')} />
        <AppFormInput
          control={form.control}
          name="regex"
          label={t('claimTypes.regex')}
          placeholder={t('claimTypes.regexPlaceholder')}
          autoCapitalize="none"
          testID="claim-type-regex"
        />
        <AppFormInput
          control={form.control}
          name="regexDescription"
          label={t('claimTypes.regexDescription')}
          placeholder={t('claimTypes.regexDescriptionPlaceholder')}
          testID="claim-type-regex-description"
        />
        <AppFormInput
          control={form.control}
          name="description"
          label={t('claimTypes.description')}
          placeholder={t('claimTypes.descriptionPlaceholder')}
          multiline
          testID="claim-type-description"
        />
        <AppFormSubmit
          error={submitError}
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
