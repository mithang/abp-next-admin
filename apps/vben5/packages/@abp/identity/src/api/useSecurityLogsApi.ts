import type { PagedResultDto } from '@abp/core';

import type {
  GetSecurityLogPagedRequest,
  SecurityLogDeleteManyInput,
  SecurityLogDto,
} from '../types/security-logs';

import { useRequest } from '@abp/request';

export function useSecurityLogsApi() {
  const { cancel, request } = useRequest();

  /**
   * Xóa nhật ký bảo mật
   * @param id id
   */
  function deleteApi(id: string): Promise<void> {
    return request(`/api/auditing/security-log/${id}`, {
      method: 'DELETE',
    });
  }

  /**
   * Xóa hàng loạt nhật ký bảo mật
   * @param input Tham số
   */
  function deleteManyApi(input: SecurityLogDeleteManyInput): Promise<void> {
    return request(`/api/auditing/security-log/bulk`, {
      data: input,
      method: 'DELETE',
    });
  }

  /**
   * Truy vấn nhật ký bảo mật
   * @param id id
   * @returns Đối tượng truyền dữ liệu thực thể nhật ký bảo mật
   */
  function getApi(id: string): Promise<SecurityLogDto> {
    return request<SecurityLogDto>(`/api/auditing/security-log/${id}`, {
      method: 'GET',
    });
  }

  /**
   * Truy vấn danh sách phân trang nhật ký bảo mật
   * @param input Tham số lọc
   * @returns Danh sách phân trang đối tượng truyền dữ liệu thực thể nhật ký bảo mật
   */
  function getPagedListApi(
    input?: GetSecurityLogPagedRequest,
  ): Promise<PagedResultDto<SecurityLogDto>> {
    return request<PagedResultDto<SecurityLogDto>>(
      `/api/auditing/security-log`,
      {
        method: 'GET',
        params: input,
      },
    );
  }

  return {
    cancel,
    deleteApi,
    deleteManyApi,
    getApi,
    getPagedListApi,
  };
}
