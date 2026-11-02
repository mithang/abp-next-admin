import { z } from 'zod';

/**
 * Schema form tạo/sửa ứng dụng OpenIddict (RHF + Zod).
 * Backend yêu cầu clientId bắt buộc (CreateOrUpdateDto); các field mảng
 * (redirectUris, postLogoutRedirectUris, grantTypes, responseTypes, scopes)
 * nhập dạng nhiều dòng, mỗi dòng một giá trị, chuyển thành mảng lúc submit.
 * clientSecret KHÔNG có trong form: không tạo client có secret từ mobile.
 */
export const applicationFormSchema = z.object({
  clientId: z
    .string()
    .trim()
    .min(1, 'openiddictApplications.clientIdRequired')
    .max(256, 'openiddictApplications.clientIdTooLong'),
  displayName: z.string().trim().max(256, 'openiddictApplications.displayNameTooLong'),
  clientType: z.string().trim().max(256, 'openiddictApplications.clientTypeTooLong'),
  applicationType: z.string().trim().max(256, 'openiddictApplications.applicationTypeTooLong'),
  consentType: z.string().trim().max(256, 'openiddictApplications.consentTypeTooLong'),
  clientUri: z.string().trim().max(2048, 'openiddictApplications.clientUriTooLong'),
  logoUri: z.string().trim().max(2048, 'openiddictApplications.logoUriTooLong'),
  redirectUris: z.string(),
  postLogoutRedirectUris: z.string(),
  grantTypes: z.string(),
  responseTypes: z.string(),
  scopes: z.string(),
});

export type ApplicationFormValues = z.infer<typeof applicationFormSchema>;

export const applicationFormDefaults: ApplicationFormValues = {
  clientId: '',
  displayName: '',
  clientType: '',
  applicationType: '',
  consentType: '',
  clientUri: '',
  logoUri: '',
  redirectUris: '',
  postLogoutRedirectUris: '',
  grantTypes: '',
  responseTypes: '',
  scopes: '',
};
