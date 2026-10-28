import type { PagedResultDto } from '@abp/core';

import type {
  ReceivedMessageEvent,
  SendTextChatMessageDto,
  TextChatMessageDto,
  TextChatMessageGetListInput,
} from '../types/chats';

import { useRequest, useSseRequest } from '@abp/request';

export function useChatsApi() {
  const { cancel, request } = useRequest();
  const { requestSSE } = useSseRequest();

  /**
   * Gửi tin nhắn
   * @param input Nội dung tin nhắn
   * @param options Tùy chọn
   * @param options.onMessage Callback nhận tin nhắn SSE
   * @param options.onEnd Callback khi tin nhắn SSE hoàn tất
   */
  function sendMessageApi(
    input: SendTextChatMessageDto,
    options?: {
      onEnd?: () => void;
      onMessage?: (event: ReceivedMessageEvent) => void;
    },
  ) {
    return requestSSE('/api/ai-management/chats', input, {
      onMessage(message) {
        const sseMessages = message.split('\n\n');
        for (const sseMessage of sseMessages) {
          if (!sseMessage.trim()) continue;
          const lines = sseMessage.split('\n');
          for (const line of lines) {
            if (line.startsWith('data:')) {
              const data = line.slice(5).trim();
              const sseData = JSON.parse(data) as { m: string };
              if (sseData.m === 'FINISHED') return;
              options?.onMessage && options?.onMessage({ content: sseData.m });
            }
          }
        }
      },
      onEnd() {
        options?.onEnd && options?.onEnd();
      },
      headers: {
        'content-type': 'application/json',
      },
    });
  }

  /**
   * Lấy danh sách phân trang nội dung phiên trò chuyện
   * @param input Tham số lọc truy vấn
   * @returns Danh sách phân trang nội dung phiên trò chuyện
   */
  function getPagedListApi(
    input: TextChatMessageGetListInput,
  ): Promise<PagedResultDto<TextChatMessageDto>> {
    return request<PagedResultDto<TextChatMessageDto>>(
      '/api/ai-management/chats',
      {
        method: 'GET',
        params: input,
      },
    );
  }

  return {
    cancel,
    getPagedListApi,
    sendMessageApi,
  };
}
