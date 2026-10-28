import type { PagedResultDto } from '@abp/core';

import type {
  ConversationCreateDto,
  ConversationDto,
  ConversationGetPagedListInput,
  ConversationUpdateDto,
} from '../types/conversations';

import { useRequest } from '@abp/request';

export function useConversationsApi() {
  const { cancel, request } = useRequest();

  /**
   * Lấy chi tiết phiên trò chuyện
   * @param id phiên trò chuyệnid
   * @returns Chi tiết phiên trò chuyện
   */
  function getApi(id: string): Promise<ConversationDto> {
    return request<ConversationDto>(
      `/api/ai-management/chats/conversations/${id}`,
      {
        method: 'GET',
      },
    );
  }

  /**
   * Lấy danh sách phân trang phiên trò chuyện
   * @param input Truy vấn tham số lọc
   * @returns Danh sách phân trang phiên trò chuyện
   */
  function getPagedListApi(
    input?: ConversationGetPagedListInput,
  ): Promise<PagedResultDto<ConversationDto>> {
    return request<PagedResultDto<ConversationDto>>(
      '/api/ai-management/chats/conversations',
      {
        method: 'GET',
        params: input,
      },
    );
  }

  /**
   * Xóa phiên trò chuyện
   * @param id phiên trò chuyệnid
   */
  function deleteApi(id: string): Promise<void> {
    return request(`/api/ai-management/chats/conversations/${id}`, {
      method: 'DELETE',
    });
  }

  /**
   * Thêm phiên trò chuyện
   * @param input Tham số
   * @returns Chi tiết phiên trò chuyện
   */
  function createApi(input: ConversationCreateDto): Promise<ConversationDto> {
    return request<ConversationDto>(`/api/ai-management/chats/conversations`, {
      data: input,
      method: 'POST',
    });
  }

  /**
   * Chỉnh sửa phiên trò chuyện
   * @param id phiên trò chuyệnid
   * @param input Tham số
   * @returns Chi tiết phiên trò chuyện
   */
  function updateApi(
    id: string,
    input: ConversationUpdateDto,
  ): Promise<ConversationDto> {
    return request<ConversationDto>(`/api/ai-management/conversations/${id}`, {
      data: input,
      method: 'PUT',
    });
  }

  return {
    cancel,
    createApi,
    deleteApi,
    getApi,
    getPagedListApi,
    updateApi,
  };
}
