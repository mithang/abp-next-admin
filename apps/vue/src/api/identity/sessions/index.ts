import { defHttp } from '/@/utils/http/axios';
import {
  IdentitySessionDto,
  GetUserSessionsInput
} from './model';

/**
 * Truy vấn danh sách phiên
 * @param { GetUserSessionsInput } input Tham số truy vấn
 * @returns { Promise<PagedResultDto<IdentitySessionDto>> }
 */
export const getSessions = (input?: GetUserSessionsInput): Promise<PagedResultDto<IdentitySessionDto>> => {
  return defHttp.get<PagedResultDto<IdentitySessionDto>>({
    url: '/api/identity/sessions',
    params: input,
  });
};
/**
 * Thu hồi phiên
 * @param { string } sessionId Id phiên
 * @returns { Promise<void> }
 */
export const revokeSession = (sessionId: string): Promise<void> => {
  return defHttp.delete<void>({
    url: `/api/identity/sessions/${sessionId}/revoke`,
  });
}
