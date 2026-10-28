import type { PagedResultDto } from '@abp/core';

import type { LogDto, LogGetListInput } from '../types/loggings';

import { useRequest } from '@abp/request';

export function useLoggingsApi() {
  const { cancel, request } = useRequest();

  /**
   * Lấy nhật ký hệ thống
   * @param id Id nhật ký
   */
  function getApi(id: string): Promise<LogDto> {
    return request<LogDto>(`/api/auditing/logging/${id}`, {
      method: 'GET',
    });
  }

  /**
   * Lấy danh sách phân trang nhật ký hệ thống
   * @param input Tham số
   */
  function getPagedListApi(
    input: LogGetListInput,
  ): Promise<PagedResultDto<LogDto>> {
    return request<PagedResultDto<LogDto>>('/api/auditing/logging', {
      method: 'GET',
      params: input,
    });
  }

  return {
    cancel,
    getApi,
    getPagedListApi,
  };
}
