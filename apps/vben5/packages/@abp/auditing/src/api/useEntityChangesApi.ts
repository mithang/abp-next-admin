import type { ListResultDto } from '@abp/core';

import type {
  EntityChangeGetWithUsernameInput,
  EntityChangeWithUsernameDto,
} from '../types/entity-changes';

import { useRequest } from '@abp/request';

export function useEntityChangesApi() {
  const { cancel, request } = useRequest();

  /**
   * Lấy danh sách thay đổi thực thể kèm tên người dùng
   * @param input Tham số
   */
  function getListWithUsernameApi(
    input: EntityChangeGetWithUsernameInput,
  ): Promise<ListResultDto<EntityChangeWithUsernameDto>> {
    return request<ListResultDto<EntityChangeWithUsernameDto>>(
      '/api/auditing/entity-changes/with-username',
      {
        method: 'GET',
        params: input,
      },
    );
  }

  return {
    cancel,
    getListWithUsernameApi,
  };
}
