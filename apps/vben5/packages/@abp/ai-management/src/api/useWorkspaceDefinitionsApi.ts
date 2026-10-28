import type { ListResultDto, PagedResultDto } from '@abp/core';

import type {
  ChatClientProviderDto,
  WorkspaceDefinitionRecordCreateDto,
  WorkspaceDefinitionRecordDto,
  WorkspaceDefinitionRecordGetPagedListInput,
  WorkspaceDefinitionRecordUpdateDto,
} from '../types/workspaces';

import { useRequest } from '@abp/request';

export function useWorkspaceDefinitionsApi() {
  const { cancel, request } = useRequest();

  /**
   * Lấy chi tiết không gian làm việc
   * @param id Id không gian làm việc
   * @returns Chi tiết không gian làm việc
   */
  function getApi(id: string): Promise<WorkspaceDefinitionRecordDto> {
    return request<WorkspaceDefinitionRecordDto>(
      `/api/ai-management/workspaces/${id}`,
      {
        method: 'GET',
      },
    );
  }

  /**
   * Lấy danh sách phân trang không gian làm việc
   * @param input Tham số lọc truy vấn
   * @returns Danh sách phân trang không gian làm việc
   */
  function getPagedListApi(
    input?: WorkspaceDefinitionRecordGetPagedListInput,
  ): Promise<PagedResultDto<WorkspaceDefinitionRecordDto>> {
    return request<PagedResultDto<WorkspaceDefinitionRecordDto>>(
      '/api/ai-management/workspaces',
      {
        method: 'GET',
        params: input,
      },
    );
  }

  /**
   * Lấy danh sách nhà cung cấp mô hình khả dụng
   * @returns Danh sách nhà cung cấp mô hình
   */
  function getAvailableProviderListApi(): Promise<
    ListResultDto<ChatClientProviderDto>
  > {
    return request<ListResultDto<ChatClientProviderDto>>(
      '/api/ai-management/workspaces/available-providers',
      {
        method: 'GET',
      },
    );
  }

  /**
   * Xóa không gian làm việc
   * @param id Id không gian làm việc
   */
  function deleteApi(id: string): Promise<void> {
    return request(`/api/ai-management/workspaces/${id}`, {
      method: 'DELETE',
    });
  }

  /**
   * Thêm không gian làm việc
   * @param input Tham số
   * @returns Chi tiết không gian làm việc
   */
  function createApi(
    input: WorkspaceDefinitionRecordCreateDto,
  ): Promise<WorkspaceDefinitionRecordDto> {
    return request<WorkspaceDefinitionRecordDto>(
      `/api/ai-management/workspaces`,
      {
        data: input,
        method: 'POST',
      },
    );
  }

  /**
   * Sửa không gian làm việc
   * @param id Id không gian làm việc
   * @param input Tham số
   * @returns Chi tiết không gian làm việc
   */
  function updateApi(
    id: string,
    input: WorkspaceDefinitionRecordUpdateDto,
  ): Promise<WorkspaceDefinitionRecordDto> {
    return request<WorkspaceDefinitionRecordDto>(
      `/api/ai-management/workspaces/${id}`,
      {
        data: input,
        method: 'PUT',
      },
    );
  }

  return {
    cancel,
    createApi,
    deleteApi,
    getApi,
    getAvailableProviderListApi,
    getPagedListApi,
    updateApi,
  };
}
