import type { PagedRequest } from '../../lib/api-client';

/**
 * DTO OpenIddict — đã kiểm chứng từ apps/vben5/packages/@abp/openiddict/src/types/*.ts
 * của web app-antd. Không đoán schema: field nào web không có thì mobile không gửi.
 * Token DTO có field payload nhưng mobile KHÔNG BAO GIỜ hiển thị nó (chỉ metadata).
 */

export interface OpenIddictApplicationFeaturesDto {
  requirePkce?: boolean;
}

export interface OpenIddictApplicationRequirementsDto {
  features: OpenIddictApplicationFeaturesDto;
}

export interface OpenIddictApplicationTokenLifetimesDto {
  accessToken?: number;
  authorizationCode?: number;
  deviceCode?: number;
  identityToken?: number;
  refreshToken?: number;
  userCode?: number;
}

export interface OpenIddictApplicationSettingsDto {
  tokenLifetime: OpenIddictApplicationTokenLifetimesDto;
}

export interface OpenIddictApplicationDto {
  id: string;
  applicationType?: string;
  clientId: string;
  clientType?: string;
  clientUri?: string;
  consentType?: string;
  displayName?: string;
  /** Đa ngôn ngữ theo DTO web — form mobile không sửa, nhưng phải giữ nguyên khi sửa. */
  displayNames?: Record<string, string>;
  /** Theo DTO web — form mobile không sửa, giữ nguyên khi sửa. */
  endpoints?: string[];
  grantTypes?: string[];
  jsonWebKeySet?: string;
  logoUri?: string;
  postLogoutRedirectUris?: string[];
  properties?: Record<string, string>;
  redirectUris?: string[];
  requirements: OpenIddictApplicationRequirementsDto;
  responseTypes?: string[];
  scopes?: string[];
  settings: OpenIddictApplicationSettingsDto;
}

export interface OpenIddictApplicationCreateOrUpdateDto {
  applicationType?: string;
  clientId: string;
  clientType?: string;
  clientUri?: string;
  consentType?: string;
  displayName?: string;
  displayNames?: Record<string, string>;
  endpoints?: string[];
  grantTypes?: string[];
  jsonWebKeySet?: string;
  logoUri?: string;
  postLogoutRedirectUris?: string[];
  properties?: Record<string, string>;
  redirectUris?: string[];
  requirements: OpenIddictApplicationRequirementsDto;
  responseTypes?: string[];
  scopes?: string[];
  settings: OpenIddictApplicationSettingsDto;
}

export interface OpenIddictApplicationGetListInput extends PagedRequest {
  filter?: string;
}

export interface OpenIddictScopeDto {
  id: string;
  description?: string;
  /** Đa ngôn ngữ theo DTO web — form mobile không sửa, giữ nguyên khi sửa. */
  descriptions?: Record<string, string>;
  displayName?: string;
  displayNames?: Record<string, string>;
  name: string;
  properties?: Record<string, string>;
  resources?: string[];
}

export interface OpenIddictScopeCreateOrUpdateDto {
  description?: string;
  descriptions?: Record<string, string>;
  displayName?: string;
  displayNames?: Record<string, string>;
  name: string;
  properties?: Record<string, string>;
  resources?: string[];
}

export interface OpenIddictScopeGetListInput extends PagedRequest {
  filter?: string;
}

export interface OpenIddictAuthorizationDto {
  id: string;
  applicationId?: string;
  creationDate?: string;
  scopes?: string[];
  status?: string;
  subject?: string;
  type?: string;
}

export interface OpenIddictAuthorizationGetListInput extends PagedRequest {
  filter?: string;
  subject?: string;
  status?: string;
  type?: string;
}

export interface OpenIddictTokenDto {
  id: string;
  applicationId?: string;
  authorizationId?: string;
  creationDate?: string;
  expirationDate?: string;
  referenceId?: string;
  status?: string;
  subject?: string;
  type?: string;
}

export interface OpenIddictTokenGetListInput extends PagedRequest {
  filter?: string;
  subject?: string;
  status?: string;
  type?: string;
  clientId?: string;
}
