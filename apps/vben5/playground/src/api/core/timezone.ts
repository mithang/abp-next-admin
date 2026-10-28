import { requestClient } from '#/api/request';

/**
 * Lấy danh sách múi giờ mà hệ thống hỗ trợ
 */
export async function getTimezoneOptionsApi() {
  return await requestClient.get<
    {
      label: string;
      value: string;
    }[]
  >('/timezone/getTimezoneOptions');
}
/**
 * Lấy múi giờ của người dùng
 */
export async function getTimezoneApi(): Promise<null | string | undefined> {
  return requestClient.get<null | string | undefined>('/timezone/getTimezone');
}
/**
 * Đặt múi giờ cho người dùng
 * @param timezone Múi giờ
 */
export async function setTimezoneApi(timezone: string): Promise<void> {
  return requestClient.post('/timezone/setTimezone', { timezone });
}
