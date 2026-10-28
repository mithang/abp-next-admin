import type { ListResultDto, PagedResultDto } from '@abp/core';

import type { IdentityRoleDto, OrganizationUnitDto } from '../types';
import type {
  IdentityClaimCreateDto,
  IdentityClaimDeleteDto,
  IdentityClaimDto,
  IdentityClaimUpdateDto,
} from '../types/claims';
import type {
  ChangeUserPasswordInput,
  GetUserPagedListInput,
  IdentityUserCreateDto,
  IdentityUserDto,
  IdentityUserUpdateDto,
} from '../types/users';

import { useRequest } from '@abp/request';

export function useUsersApi() {
  const { cancel, request } = useRequest();

  /**
   * Thêm người dùng mới
   * @param input tham số
   * @returns đối tượng truyền dữ liệu thực thể người dùng
   */
  function createApi(input: IdentityUserCreateDto): Promise<IdentityUserDto> {
    return request<IdentityUserDto>('/api/identity/users', {
      data: input,
      method: 'POST',
    });
  }

  /**
   * Xóa người dùng
   * @param id id người dùng
   */
  function deleteApi(id: string): Promise<void> {
    return request(`/api/identity/users/${id}`, {
      method: 'DELETE',
    });
  }

  /**
   * Truy vấn người dùng
   * @param id id người dùng
   * @returns đối tượng truyền dữ liệu thực thể người dùng
   */
  function getApi(id: string): Promise<IdentityUserDto> {
    return request<IdentityUserDto>(`/api/identity/users/${id}`, {
      method: 'GET',
    });
  }

  /**
   * Cập nhật người dùng
   * @param id id người dùng
   * @returns đối tượng truyền dữ liệu thực thể người dùng
   */
  function updateApi(
    id: string,
    input: IdentityUserUpdateDto,
  ): Promise<IdentityUserDto> {
    return request<IdentityUserDto>(`/api/identity/users/${id}`, {
      data: input,
      method: 'PUT',
    });
  }

  /**
   * Truy vấn danh sách phân trang người dùng
   * @param input tham số lọc
   * @returns danh sách phân trang đối tượng truyền dữ liệu thực thể người dùng
   */
  function getPagedListApi(
    input?: GetUserPagedListInput,
  ): Promise<PagedResultDto<IdentityUserDto>> {
    return request<PagedResultDto<IdentityUserDto>>(`/api/identity/users`, {
      method: 'GET',
      params: input,
    });
  }

  /**
   * Xóa người dùng khỏi tổ chức
   * @param id id người dùng
   * @param ouId id tổ chức
   */
  function removeOrganizationUnitApi(id: string, ouId: string): Promise<void> {
    return request(`/api/identity/users/${id}/organization-units/${ouId}`, {
      method: 'DELETE',
    });
  }

  /**
   * Lấy danh sách tổ chức của người dùng
   * @param id id người dùng
   */
  function getOrganizationUnitsApi(
    id: string,
  ): Promise<ListResultDto<OrganizationUnitDto>> {
    return request<ListResultDto<OrganizationUnitDto>>(
      `/api/identity/users/${id}/organization-units`,
      {
        method: 'GET',
      },
    );
  }

  /**
   * Khóa người dùng
   * @param id id người dùng
   * @param seconds thời gian khóa(giây)
   */
  function lockApi(id: string, seconds: number): Promise<void> {
    return request(`/api/identity/users/${id}/lock/${seconds}`, {
      method: 'PUT',
    });
  }

  /**
   * Mở khóa người dùng
   * @param id id người dùng
   */
  function unLockApi(id: string): Promise<void> {
    return request(`/api/identity/users/${id}/unlock`, {
      method: 'PUT',
    });
  }

  /**
   * Đổi mật khẩu người dùng
   * @param id id người dùng
   * @param input dto thay đổi mật khẩu
   */
  function changePasswordApi(
    id: string,
    input: ChangeUserPasswordInput,
  ): Promise<void> {
    return request(`/api/identity/users/change-password?id=${id}`, {
      data: input,
      method: 'PUT',
    });
  }

  /**
   * Lấy danh sách vai trò khả dụng
   */
  function getAssignableRolesApi(): Promise<ListResultDto<IdentityRoleDto>> {
    return request<ListResultDto<IdentityRoleDto>>(
      `/api/identity/users/assignable-roles`,
      {
        method: 'GET',
      },
    );
  }

  /**
   * Lấy danh sách vai trò của người dùng
   * @param id id người dùng
   */
  function getRolesApi(id: string): Promise<ListResultDto<IdentityRoleDto>> {
    return request<ListResultDto<IdentityRoleDto>>(
      `/api/identity/users/${id}/roles`,
      {
        method: 'GET',
      },
    );
  }

  /**
   * Lấy danh sách claim của người dùng
   * @param id id người dùng
   */
  function getClaimsApi(id: string): Promise<ListResultDto<IdentityClaimDto>> {
    return request<ListResultDto<IdentityClaimDto>>(
      `/api/identity/users/${id}/claims`,
      {
        method: 'GET',
      },
    );
  }

  /**
   * Xóa claim của người dùng
   * @param id id người dùng
   * @param input dto claim người dùng
   */
  function deleteClaimApi(
    id: string,
    input: IdentityClaimDeleteDto,
  ): Promise<void> {
    return request(`/api/identity/users/${id}/claims`, {
      method: 'DELETE',
      params: input,
    });
  }

  /**
   * Tạo claim của người dùng
   * @param id id người dùng
   * @param input dto claim người dùng
   */
  function createClaimApi(
    id: string,
    input: IdentityClaimCreateDto,
  ): Promise<void> {
    return request(`/api/identity/users/${id}/claims`, {
      data: input,
      method: 'POST',
    });
  }

  /**
   * Cập nhật claim của người dùng
   * @param id id người dùng
   * @param input dto claim người dùng
   */
  function updateClaimApi(
    id: string,
    input: IdentityClaimUpdateDto,
  ): Promise<void> {
    return request(`/api/identity/users/${id}/claims`, {
      data: input,
      method: 'PUT',
    });
  }

  return {
    cancel,
    changePasswordApi,
    createApi,
    createClaimApi,
    deleteApi,
    deleteClaimApi,
    getApi,
    getAssignableRolesApi,
    getClaimsApi,
    getOrganizationUnitsApi,
    getPagedListApi,
    getRolesApi,
    lockApi,
    removeOrganizationUnitApi,
    unLockApi,
    updateApi,
    updateClaimApi,
  };
}
