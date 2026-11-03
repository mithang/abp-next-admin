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
import {
  createApplication,
  getApplication,
  updateApplication,
} from '../../../features/openiddict/applications-api';
import {
  applicationFormDefaults,
  applicationFormSchema,
  type ApplicationFormValues,
} from '../../../features/openiddict/application-form-schema';
import { parseMultiline, toMultiline } from '../../../features/openiddict/multiline';
import { useSubmitError } from '../../../lib/use-submit-error';
import { queryStateElement } from '../../../lib/query-state';
import { createFieldError } from '../../../lib/field-error';
import { useInvalidateAndBack } from '../../../lib/mutation-success';

/**
 * Form tạo/sửa ứng dụng: route /openiddict/applications/form (tạo) hoặc
 * /openiddict/applications/form?id=<id> (sửa), theo pattern /roles/form.
 * Field mảng nhập nhiều dòng, chuyển thành mảng lúc submit; create/update
 * luôn gửi requirements/settings mặc định (xem applications-api.ts).
 * Không có field clientSecret: không tạo client có secret từ mobile.
 */
const MULTILINE_FIELDS = [
  {
    name: 'redirectUris',
    labelKey: 'openiddictApplications.redirectUris',
    placeholderKey: 'openiddictApplications.redirectUrisPlaceholder',
  },
  {
    name: 'postLogoutRedirectUris',
    labelKey: 'openiddictApplications.postLogoutRedirectUris',
    placeholderKey: 'openiddictApplications.postLogoutRedirectUrisPlaceholder',
  },
  {
    name: 'grantTypes',
    labelKey: 'openiddictApplications.grantTypes',
    placeholderKey: 'openiddictApplications.grantTypesPlaceholder',
  },
  {
    name: 'responseTypes',
    labelKey: 'openiddictApplications.responseTypes',
    placeholderKey: 'openiddictApplications.responseTypesPlaceholder',
  },
  {
    name: 'scopes',
    labelKey: 'openiddictApplications.scopes',
    placeholderKey: 'openiddictApplications.scopesPlaceholder',
  },
] as const;

const TEXT_FIELDS = [
  {
    name: 'clientId',
    labelKey: 'openiddictApplications.clientId',
    placeholderKey: 'openiddictApplications.clientIdPlaceholder',
  },
  {
    name: 'displayName',
    labelKey: 'openiddictApplications.displayName',
    placeholderKey: 'openiddictApplications.displayNamePlaceholder',
  },
  {
    name: 'clientType',
    labelKey: 'openiddictApplications.clientType',
    placeholderKey: 'openiddictApplications.clientTypePlaceholder',
  },
  {
    name: 'applicationType',
    labelKey: 'openiddictApplications.applicationType',
    placeholderKey: 'openiddictApplications.applicationTypePlaceholder',
  },
  {
    name: 'consentType',
    labelKey: 'openiddictApplications.consentType',
    placeholderKey: 'openiddictApplications.consentTypePlaceholder',
  },
  {
    name: 'clientUri',
    labelKey: 'openiddictApplications.clientUri',
    placeholderKey: 'openiddictApplications.clientUriPlaceholder',
  },
  {
    name: 'logoUri',
    labelKey: 'openiddictApplications.logoUri',
    placeholderKey: 'openiddictApplications.logoUriPlaceholder',
  },
] as const;

export default function ApplicationFormScreen() {
  const { t } = useTranslation();
  const invalidateAndBack = useInvalidateAndBack(['openiddict-applications']);
  const { id } = useRouteParams<{ id?: string }>();
  const isEdit = Boolean(id);
  const {
    error: submitError,
    onError: handleSubmitError,
    clearError: clearSubmitError,
  } = useSubmitError();

  const detail = useDetailQuery('openiddict-applications', id, getApplication);

  const form = useForm<ApplicationFormValues>({
    resolver: zodResolver(applicationFormSchema),
    defaultValues: applicationFormDefaults,
    values: detail.data
      ? {
          clientId: detail.data.clientId,
          displayName: detail.data.displayName ?? '',
          clientType: detail.data.clientType ?? '',
          applicationType: detail.data.applicationType ?? '',
          consentType: detail.data.consentType ?? '',
          clientUri: detail.data.clientUri ?? '',
          logoUri: detail.data.logoUri ?? '',
          redirectUris: toMultiline(detail.data.redirectUris),
          postLogoutRedirectUris: toMultiline(detail.data.postLogoutRedirectUris),
          grantTypes: toMultiline(detail.data.grantTypes),
          responseTypes: toMultiline(detail.data.responseTypes),
          scopes: toMultiline(detail.data.scopes),
        }
      : undefined,
  });

  const mutation = useMutation({
    mutationFn: async (values: ApplicationFormValues) => {
      const body = {
        clientId: values.clientId,
        displayName: values.displayName || undefined,
        clientType: values.clientType || undefined,
        applicationType: values.applicationType || undefined,
        consentType: values.consentType || undefined,
        clientUri: values.clientUri || undefined,
        logoUri: values.logoUri || undefined,
        redirectUris: parseMultiline(values.redirectUris),
        postLogoutRedirectUris: parseMultiline(values.postLogoutRedirectUris),
        grantTypes: parseMultiline(values.grantTypes),
        responseTypes: parseMultiline(values.responseTypes),
        scopes: parseMultiline(values.scopes),
      };
      // Khi sửa: giữ nguyên các field web có mà form mobile chưa sửa được
      // (displayNames đa ngôn ngữ, properties, endpoints, jsonWebKeySet và
      // requirements/settings hiện có) để lần sửa không vô tình xóa chúng.
      if (isEdit && detail.data)
        return updateApplication(id as string, {
          ...body,
          displayNames: detail.data.displayNames,
          properties: detail.data.properties,
          endpoints: detail.data.endpoints,
          jsonWebKeySet: detail.data.jsonWebKeySet,
          requirements: detail.data.requirements,
          settings: detail.data.settings,
        });
      if (isEdit) return updateApplication(id as string, body);
      return createApplication(body);
    },
    onSuccess: invalidateAndBack,
    onError: handleSubmitError,
  });

  const queryState = queryStateElement(detail);
  if (isEdit && queryState) return queryState;

  const fieldError = createFieldError(t, 'openiddictApplications');

  return (
    <AppScreen
      scrollable
      title={
        isEdit ? t('openiddictApplications.editTitle') : t('openiddictApplications.createTitle')
      }
    >
      <VStack space="md">
        {TEXT_FIELDS.map((fieldDef) => (
          <AppFormInput
            key={fieldDef.name}
            control={form.control}
            name={fieldDef.name}
            label={t(fieldDef.labelKey)}
            placeholder={t(fieldDef.placeholderKey)}
            autoCapitalize="none"
            fieldError={fieldError}
            testID={`application-${fieldDef.name}`}
          />
        ))}
        {MULTILINE_FIELDS.map((fieldDef) => (
          <AppFormInput
            key={fieldDef.name}
            control={form.control}
            name={fieldDef.name}
            label={t(fieldDef.labelKey)}
            placeholder={t(fieldDef.placeholderKey)}
            autoCapitalize="none"
            multiline
            fieldError={fieldError}
            testID={`application-${fieldDef.name}`}
          />
        ))}
        <AppFormSubmit
          error={submitError}
          title={isEdit ? t('common.save') : t('common.create')}
          onPress={form.handleSubmit((values) => {
            clearSubmitError();
            mutation.mutate(values);
          })}
          loading={mutation.isPending}
          testID="application-submit"
        />
      </VStack>
    </AppScreen>
  );
}
