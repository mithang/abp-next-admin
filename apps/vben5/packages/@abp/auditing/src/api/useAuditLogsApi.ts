import type { PagedResultDto } from '@abp/core';

import type {
  AuditLogDeleteManyInput,
  AuditLogDto,
  AuditLogGetListInput,
} from '../types/audit-logs';

import { useRequest } from '@abp/request';

export function useAuditLogsApi() {
  const { cancel, request } = useRequest();

  /**
   * Lấy nhật ký kiểm toán
   * @param id Id nhật ký
   */
  function getApi(id: string): Promise<AuditLogDto> {
    return request<AuditLogDto>(`/api/auditing/audit-log/${id}`, {
      method: 'GET',
    });
  }

  /**
   * Lấy danh sách phân trang nhật ký kiểm toán
   * @param input Tham số
   */
  function getPagedListApi(
    input: AuditLogGetListInput,
  ): Promise<PagedResultDto<AuditLogDto>> {
    return request<PagedResultDto<AuditLogDto>>('/api/auditing/audit-log', {
      method: 'GET',
      params: input,
    });
  }

  /**
   * Xóa nhật ký kiểm toán
   * @param id Id nhật ký
   */
  function deleteApi(id: string): Promise<void> {
    return request(`/api/auditing/audit-log/${id}`, {
      method: 'DELETE',
    });
  }

  /**
   * Xóa hàng loạt nhật ký kiểm toán
   * @param input Tham số
   */
  function deleteManyApi(input: AuditLogDeleteManyInput): Promise<void> {
    return request(`/api/auditing/audit-log/bulk`, {
      data: input,
      method: 'DELETE',
    });
  }

  return {
    cancel,
    deleteApi,
    deleteManyApi,
    getApi,
    getPagedListApi,
  };
}
