import type { ListResultDto, PagedResultDto } from '@abp/core';

import type {
  IdentityClaimCreateDto,
  IdentityClaimDeleteDto,
  IdentityClaimDto,
  IdentityClaimUpdateDto,
} from '../types/claims';
import type {
  GetRolePagedListInput,
  IdentityRoleCreateDto,
  IdentityRoleDto,
  IdentityRoleUpdateDto,
} from '../types/roles';

import { useRequest } from '@abp/request';

export function useRolesApi() {
  const { cancel, request } = useRequest();
  /**
   * Thêm mới vai trò
   * @param input Tham số
   * @returns Đối tượng truyền dữ liệu thực thể vai trò
   */
  function createApi(input: IdentityRoleCreateDto): Promise<IdentityRoleDto> {
    return request<IdentityRoleDto>('/api/identity/roles', {
      data: input,
      method: 'POST',
    });
  }

  /**
   * Xóa vai trò
   * @param id Id vai trò
   */
  function deleteApi(id: string): Promise<void> {
    return request(`/api/identity/roles/${id}`, {
      method: 'DELETE',
    });
  }

  /**
   * Truy vấn vai trò
   * @param id Id vai trò
   * @returns Đối tượng truyền dữ liệu thực thể vai trò
   */
  function getApi(id: string): Promise<IdentityRoleDto> {
    return request<IdentityRoleDto>(`/api/identity/roles/${id}`, {
      method: 'GET',
    });
  }

  /**
   * Cập nhật vai trò
   * @param id Id vai trò
   * @returns Đối tượng truyền dữ liệu thực thể vai trò
   */
  function updateApi(
    id: string,
    input: IdentityRoleUpdateDto,
  ): Promise<IdentityRoleDto> {
    return request<IdentityRoleDto>(`/api/identity/roles/${id}`, {
      data: input,
      method: 'PUT',
    });
  }

  /**
   * Truy vấn danh sách phân trang vai trò
   * @param input Tham số lọc
   * @returns Danh sách phân trang đối tượng truyền dữ liệu thực thể vai trò
   */
  function getPagedListApi(
    input?: GetRolePagedListInput,
  ): Promise<PagedResultDto<IdentityRoleDto>> {
    return request<PagedResultDto<IdentityRoleDto>>(`/api/identity/roles`, {
      method: 'GET',
      params: input,
    });
  }

  /**
   * Xóa vai trò khỏi tổ chức
   * @param id Id vai trò
   * @param ouId Id tổ chức
   */
  function removeOrganizationUnitApi(id: string, ouId: string): Promise<void> {
    return request(`/api/identity/roles/${id}/organization-units/${ouId}`, {
      method: 'DELETE',
    });
  }

  /**
   * Lấy danh sách claim của vai trò
   * @param id Id vai trò
   */
  function getClaimsApi(id: string): Promise<ListResultDto<IdentityClaimDto>> {
    return request<ListResultDto<IdentityClaimDto>>(
      `/api/identity/roles/${id}/claims`,
      {
        method: 'GET',
      },
    );
  }

  /**
   * Xóa claim của vai trò
   * @param id Id vai trò
   * @param input DTO claim của vai trò
   */
  function deleteClaimApi(
    id: string,
    input: IdentityClaimDeleteDto,
  ): Promise<void> {
    return request(`/api/identity/roles/${id}/claims`, {
      method: 'DELETE',
      params: input,
    });
  }

  /**
   * Tạo claim của vai trò
   * @param id Id vai trò
   * @param input DTO claim của vai trò
   */
  function createClaimApi(
    id: string,
    input: IdentityClaimCreateDto,
  ): Promise<void> {
    return request(`/api/identity/roles/${id}/claims`, {
      data: input,
      method: 'POST',
    });
  }

  /**
   * Cập nhật claim của vai trò
   * @param id Id vai trò
   * @param input DTO vai trò của người dùng
   */
  function updateClaimApi(
    id: string,
    input: IdentityClaimUpdateDto,
  ): Promise<void> {
    return request(`/api/identity/roles/${id}/claims`, {
      data: input,
      method: 'PUT',
    });
  }

  return {
    cancel,
    createApi,
    createClaimApi,
    deleteApi,
    deleteClaimApi,
    getApi,
    getClaimsApi,
    getPagedListApi,
    removeOrganizationUnitApi,
    updateApi,
    updateClaimApi,
  };
}
