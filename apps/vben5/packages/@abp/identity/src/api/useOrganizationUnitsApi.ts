import type { ListResultDto, PagedResultDto } from '@abp/core';

import type { IdentityRoleDto, IdentityUserDto } from '../types';
import type {
  GetIdentityRolesInput,
  GetIdentityUsersInput,
  GetOrganizationUnitPagedListInput,
  GetUnaddedRoleListInput,
  GetUnaddedUserListInput,
  OrganizationUnitAddRoleDto,
  OrganizationUnitAddUserDto,
  OrganizationUnitCreateDto,
  OrganizationUnitDto,
  OrganizationUnitGetChildrenDto,
  OrganizationUnitUpdateDto,
} from '../types/organization-units';

import { useRequest } from '@abp/request';

export function useOrganizationUnitsApi() {
  const { cancel, request } = useRequest();

  /**
   * Thêm mới tổ chức
   * @param input Tham số
   * @returns Đối tượng truyền dữ liệu thực thể tổ chức
   */
  function createApi(
    input: OrganizationUnitCreateDto,
  ): Promise<OrganizationUnitDto> {
    return request<OrganizationUnitDto>('/api/identity/organization-units', {
      data: input,
      method: 'POST',
    });
  }

  /**
   * Xóa tổ chức
   * @param id Id tổ chức
   */
  function deleteApi(id: string): Promise<void> {
    return request(`/api/identity/organization-units/${id}`, {
      method: 'DELETE',
    });
  }

  /**
   * Truy vấn tổ chức
   * @param id Id tổ chức
   * @returns Đối tượng truyền dữ liệu thực thể tổ chức
   */
  function getApi(id: string): Promise<OrganizationUnitDto> {
    return request<OrganizationUnitDto>(
      `/api/identity/organization-units/${id}`,
      {
        method: 'GET',
      },
    );
  }

  /**
   * Cập nhật tổ chức
   * @param id Id tổ chức
   * @returns Đối tượng truyền dữ liệu thực thể tổ chức
   */
  function updateApi(
    id: string,
    input: OrganizationUnitUpdateDto,
  ): Promise<OrganizationUnitDto> {
    return request<OrganizationUnitDto>(
      `/api/identity/organization-units/${id}`,
      {
        data: input,
        method: 'PUT',
      },
    );
  }

  /**
   * Truy vấn danh sách phân trang tổ chức
   * @param input Tham số lọc
   * @returns Danh sách phân trang đối tượng truyền dữ liệu thực thể tổ chức
   */
  function getPagedListApi(
    input?: GetOrganizationUnitPagedListInput,
  ): Promise<PagedResultDto<OrganizationUnitDto>> {
    return request<PagedResultDto<OrganizationUnitDto>>(
      `/api/identity/organization-units`,
      {
        method: 'GET',
        params: input,
      },
    );
  }

  /**
   * Truy vấn danh sách tổ chức gốc
   * @returns Danh sách đối tượng truyền dữ liệu thực thể tổ chức
   */
  function getRootListApi(): Promise<ListResultDto<OrganizationUnitDto>> {
    return request<ListResultDto<OrganizationUnitDto>>(
      `/api/identity/organization-units/root-node`,
      {
        method: 'GET',
      },
    );
  }

  /**
   * Truy vấn danh sách tổ chức
   * @returns Danh sách đối tượng truyền dữ liệu thực thể tổ chức
   */
  function getAllListApi(): Promise<ListResultDto<OrganizationUnitDto>> {
    return request<ListResultDto<OrganizationUnitDto>>(
      `/api/identity/organization-units/all`,
      {
        method: 'GET',
      },
    );
  }

  /**
   * Truy vấn danh sách tổ chức cấp dưới
   * @param input Tham số truy vấn
   * @returns Danh sách đối tượng truyền dữ liệu thực thể tổ chức
   */
  function getChildrenApi(
    input: OrganizationUnitGetChildrenDto,
  ): Promise<ListResultDto<OrganizationUnitDto>> {
    return request<ListResultDto<OrganizationUnitDto>>(
      `/api/identity/organization-units/find-children`,
      {
        method: 'GET',
        params: input,
      },
    );
  }

  /**
   * Truy vấn danh sách người dùng của tổ chức
   * @param id Id tổ chức
   * @param input Tham số lọc truy vấn
   * @returns Danh sách phân trang đối tượng truyền dữ liệu thực thể người dùng
   */
  function getUserListApi(
    id: string,
    input?: GetIdentityUsersInput,
  ): Promise<PagedResultDto<IdentityUserDto>> {
    return request<PagedResultDto<IdentityUserDto>>(
      `/api/identity/organization-units/${id}/users`,
      {
        method: 'GET',
        params: input,
      },
    );
  }

  /**
   * Truy vấn danh sách người dùng chưa tham gia tổ chức
   * @param input Tham số lọc truy vấn
   * @returns Danh sách phân trang đối tượng truyền dữ liệu thực thể người dùng
   */
  function getUnaddedUserListApi(
    input: GetUnaddedUserListInput,
  ): Promise<PagedResultDto<IdentityUserDto>> {
    return request<PagedResultDto<IdentityUserDto>>(
      `/api/identity/organization-units/${input.id}/unadded-users`,
      {
        method: 'GET',
        params: input,
      },
    );
  }

  /**
   * Thêm người dùng vào tổ chức
   * @param id Id tổ chức
   * @param input Danh sách id người dùng
   */
  function addMembers(
    id: string,
    input: OrganizationUnitAddUserDto,
  ): Promise<void> {
    return request(`/api/identity/organization-units/${id}/users`, {
      data: input,
      method: 'POST',
    });
  }

  /**
   * Truy vấn danh sách vai trò của tổ chức
   * @param id Id tổ chức
   * @param input Tham số lọc truy vấn
   * @returns Danh sách phân trang đối tượng truyền dữ liệu thực thể vai trò
   */
  function getRoleListApi(
    id: string,
    input?: GetIdentityRolesInput,
  ): Promise<PagedResultDto<IdentityRoleDto>> {
    return request<PagedResultDto<IdentityRoleDto>>(
      `/api/identity/organization-units/${id}/roles`,
      {
        method: 'GET',
        params: input,
      },
    );
  }

  /**
   * Truy vấn danh sách vai trò chưa tham gia tổ chức
   * @param input Tham số lọc truy vấn
   * @returns Danh sách phân trang đối tượng truyền dữ liệu thực thể vai trò
   */
  function getUnaddedRoleListApi(
    input: GetUnaddedRoleListInput,
  ): Promise<PagedResultDto<IdentityRoleDto>> {
    return request<PagedResultDto<IdentityRoleDto>>(
      `/api/identity/organization-units/${input.id}/unadded-roles`,
      {
        method: 'GET',
        params: input,
      },
    );
  }

  /**
   * Thêm vai trò vào tổ chức
   * @param id Id tổ chức
   * @param input Danh sách id vai trò
   */
  function addRoles(
    id: string,
    input: OrganizationUnitAddRoleDto,
  ): Promise<void> {
    return request(`/api/identity/organization-units/${id}/roles`, {
      data: input,
      method: 'POST',
    });
  }

  /**
   * Di chuyển tổ chức
   * @param id Id tổ chức
   * @param parentId Id tổ chức cấp trên
   */
  function moveTo(id: string, parentId?: string): Promise<void> {
    return request(`api/identity/organization-units/${id}/move`, {
      data: { parentId },
      method: 'PUT',
    });
  }

  return {
    addMembers,
    addRoles,
    cancel,
    createApi,
    deleteApi,
    getAllListApi,
    getApi,
    getChildrenApi,
    getPagedListApi,
    getRoleListApi,
    getRootListApi,
    getUnaddedRoleListApi,
    getUnaddedUserListApi,
    getUserListApi,
    moveTo,
    updateApi,
  };
}
