import type { ListResultDto, PagedResultDto } from '@abp/core';

import type {
  GetTenantPagedListInput,
  TenantConnectionStringCheckInput,
  TenantConnectionStringDto,
  TenantConnectionStringSetInput,
  TenantCreateDto,
  TenantDto,
  TenantUpdateDto,
} from '../types';

import { useRequest } from '@abp/request';

export function useTenantsApi() {
  const { cancel, request } = useRequest();
  /**
   * Tạo tenant
   * @param {TenantCreateDto} input Tham số
   * @returns Tenant đã tạo
   */
  function createApi(input: TenantCreateDto): Promise<TenantDto> {
    return request<TenantDto>('/api/saas/tenants', {
      data: input,
      method: 'POST',
    });
  }

  /**
   * Chỉnh sửa tenant
   * @param {string} id Tham số
   * @param {TenantUpdateDto} input Tham số
   * @returns Tenant đã chỉnh sửa
   */
  function updateApi(id: string, input: TenantUpdateDto): Promise<TenantDto> {
    return request<TenantDto>(`/api/saas/tenants/${id}`, {
      data: input,
      method: 'PUT',
    });
  }

  /**
   * Truy vấn tenant
   * @param {string} id Id
   * @returns Tenant truy vấn được
   */
  function getApi(id: string): Promise<TenantDto> {
    return request<TenantDto>(`/api/saas/tenants/${id}`, {
      method: 'GET',
    });
  }

  /**
   * Xóa tenant
   * @param {string} id Id
   * @returns {void}
   */
  function deleteApi(id: string): Promise<void> {
    return request(`/api/saas/tenants/${id}`, {
      method: 'DELETE',
    });
  }

  /**
   * Truy vấn danh sách phân trang tenant
   * @param {GetTenantPagedListInput} input Tham số
   * @returns {void}
   */
  function getPagedListApi(
    input?: GetTenantPagedListInput,
  ): Promise<PagedResultDto<TenantDto>> {
    return request<PagedResultDto<TenantDto>>(`/api/saas/tenants`, {
      method: 'GET',
      params: input,
    });
  }

  /**
   * Đặt chuỗi kết nối
   * @param {string} id Id tenant
   * @param {TenantConnectionStringSetInput} input Tham số
   * @returns Chuỗi kết nối
   */
  function setConnectionStringApi(
    id: string,
    input: TenantConnectionStringSetInput,
  ): Promise<TenantConnectionStringDto> {
    return request<TenantConnectionStringDto>(
      `/api/saas/tenants/${id}/connection-string`,
      {
        data: input,
        method: 'PUT',
      },
    );
  }

  /**
   * Truy vấn chuỗi kết nối
   * @param {string} id Id tenant
   * @param {string} name Tên chuỗi kết nối
   * @returns Chuỗi kết nối
   */
  function getConnectionStringApi(
    id: string,
    name: string,
  ): Promise<TenantConnectionStringDto> {
    return request<TenantConnectionStringDto>(
      `/api/saas/tenants/${id}/connection-string/${name}`,
      {
        method: 'GET',
      },
    );
  }

  /**
   * Truy vấn tất cả chuỗi kết nối
   * @param {string} id Id tenant
   * @returns Danh sách chuỗi kết nối
   */
  function getConnectionStringsApi(
    id: string,
  ): Promise<ListResultDto<TenantConnectionStringDto>> {
    return request<ListResultDto<TenantConnectionStringDto>>(
      `/api/saas/tenants/${id}/connection-string`,
      {
        method: 'GET',
      },
    );
  }

  /**
   * Xóa tenant
   * @param {string} id Id tenant
   * @param {string} name Tên chuỗi kết nối
   * @returns {void}
   */
  function deleteConnectionStringApi(id: string, name: string): Promise<void> {
    return request(`/api/saas/tenants/${id}/connection-string/${name}`, {
      method: 'DELETE',
    });
  }

  /**
   * Kiểm tra chuỗi kết nối cơ sở dữ liệu
   * @param input Tham số
   */
  function checkConnectionString(
    input: TenantConnectionStringCheckInput,
  ): Promise<void> {
    return request(`/api/saas/tenants/connection-string/check`, {
      data: input,
      method: 'POST',
    });
  }

  return {
    cancel,
    checkConnectionString,
    createApi,
    deleteApi,
    deleteConnectionStringApi,
    getApi,
    getConnectionStringApi,
    getConnectionStringsApi,
    getPagedListApi,
    setConnectionStringApi,
    updateApi,
  };
}
