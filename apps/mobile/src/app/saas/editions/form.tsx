import { useState } from 'react';
import { useRouteParams } from '../../../lib/route-params';
import { useMutation } from '@tanstack/react-query';
import { useDetailQuery } from '../../../lib/use-detail-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import { AppScreen } from '../../../components/ui/AppScreen';
import { AppFormInput } from '../../../components/ui/AppFormInput';
import { AppFormSubmit } from '../../../components/ui/AppFormSubmit';
import { VStack } from '@/components/ui/vstack';
import { createEdition, getEdition, updateEdition } from '../../../features/saas/saas-api';
import {
  editionFormDefaults,
  editionFormSchema,
  parseExtraPropertiesJson,
  type EditionFormValues,
} from '../../../features/saas/edition-form-schema';
import { toApiError } from '../../../lib/errors';
import { queryStateElement } from '../../../lib/query-state';
import { createFieldError } from '../../../lib/field-error';
import { useInvalidateAndBack } from '../../../lib/mutation-success';

/** Form tạo/sửa phiên bản: chỉ displayName (+ extraProperties JSON); sửa gửi kèm concurrencyStamp. */
export default function EditionFormScreen() {
  const { t } = useTranslation();
  const invalidateAndBack = useInvalidateAndBack(['saas-editions']);
  const { id } = useRouteParams<{ id?: string }>();
  const isEdit = Boolean(id);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const detail = useDetailQuery('saas-editions', id, getEdition);

  const form = useForm<EditionFormValues>({
    resolver: zodResolver(editionFormSchema),
    defaultValues: editionFormDefaults,
    values: detail.data
      ? {
          displayName: detail.data.displayName,
          extraPropertiesJson:
            detail.data.extraProperties && Object.keys(detail.data.extraProperties).length > 0
              ? JSON.stringify(detail.data.extraProperties)
              : '',
        }
      : undefined,
  });

  const mutation = useMutation({
    mutationFn: async (values: EditionFormValues) => {
      const shared = {
        displayName: values.displayName.trim(),
        extraProperties: parseExtraPropertiesJson(values),
      };
      if (isEdit) {
        return updateEdition(id as string, {
          ...shared,
          concurrencyStamp: detail.data?.concurrencyStamp ?? '',
        });
      }
      return createEdition(shared);
    },
    onSuccess: invalidateAndBack,
    onError: (error) => setSubmitError(toApiError(error).message),
  });

  const queryState = queryStateElement(detail);
  if (isEdit && queryState) return queryState;

  const fieldError = createFieldError(t, 'saasEditions');

  return (
    <AppScreen scrollable title={t(isEdit ? 'saasEditions.editTitle' : 'saasEditions.createTitle')}>
      <VStack space="sm">
        <AppFormInput
          control={form.control}
          name="displayName"
          label={t('saasEditions.displayName')}
          placeholder={t('saasEditions.displayNamePlaceholder')}
          fieldError={fieldError}
        />
        <AppFormInput
          control={form.control}
          name="extraPropertiesJson"
          label={t('saasEditions.extraProperties')}
          placeholder={t('saasEditions.extraPropertiesPlaceholder')}
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
