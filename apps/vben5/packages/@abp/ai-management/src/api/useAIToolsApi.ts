import type { ListResultDto, PagedResultDto } from '@abp/core';

import type {
  AIToolDefinitionRecordCreateDto,
  AIToolDefinitionRecordDto,
  AIToolDefinitionRecordGetPagedListInput,
  AIToolDefinitionRecordUpdateDto,
  AIToolProviderDto,
} from '../types/tools';

import { useRequest } from '@abp/request';

export function useAIToolsApi() {
  const { cancel, request } = useRequest();

  /**
   * Lấy chi tiết công cụ AI
   * @param id Id công cụ AI
   * @returns Chi tiết công cụ AI
   */
  function getApi(id: string): Promise<AIToolDefinitionRecordDto> {
    return request<AIToolDefinitionRecordDto>(
      `/api/ai-management/tools/${id}`,
      {
        method: 'GET',
      },
    );
  }

  /**
   * Lấy danh sách phân trang công cụ AI
   * @param input Tham số lọc truy vấn
   * @returns Danh sách phân trang công cụ AI
   */
  function getPagedListApi(
    input?: AIToolDefinitionRecordGetPagedListInput,
  ): Promise<PagedResultDto<AIToolDefinitionRecordDto>> {
    return request<PagedResultDto<AIToolDefinitionRecordDto>>(
      '/api/ai-management/tools',
      {
        method: 'GET',
        params: input,
      },
    );
  }

  /**
   * Lấy danh sách nhà cung cấp công cụ AI khả dụng
   * @returns Danh sách nhà cung cấp công cụ AI
   */
  function getAvailableProviderListApi(): Promise<
    ListResultDto<AIToolProviderDto>
  > {
    return request<ListResultDto<AIToolProviderDto>>(
      '/api/ai-management/tools/available-providers',
      {
        method: 'GET',
      },
    );
  }

  /**
   * Xóa công cụ AI
   * @param id Id công cụ AI
   */
  function deleteApi(id: string): Promise<void> {
    return request(`/api/ai-management/tools/${id}`, {
      method: 'DELETE',
    });
  }

  /**
   * Thêm công cụ AI
   * @param input Tham số
   * @returns Chi tiết công cụ AI
   */
  function createApi(
    input: AIToolDefinitionRecordCreateDto,
  ): Promise<AIToolDefinitionRecordDto> {
    return request<AIToolDefinitionRecordDto>(`/api/ai-management/tools`, {
      data: input,
      method: 'POST',
    });
  }

  /**
   * Sửa công cụ AI
   * @param id Id công cụ AI
   * @param input Tham số
   * @returns Chi tiết công cụ AI
   */
  function updateApi(
    id: string,
    input: AIToolDefinitionRecordUpdateDto,
  ): Promise<AIToolDefinitionRecordDto> {
    return request<AIToolDefinitionRecordDto>(
      `/api/ai-management/tools/${id}`,
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
