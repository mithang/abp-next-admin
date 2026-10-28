import type { ListResultDto } from '@abp/core';

import type {
  FeatureGroupDefinitionCreateDto,
  FeatureGroupDefinitionDto,
  FeatureGroupDefinitionGetListInput,
  FeatureGroupDefinitionUpdateDto,
} from '../types/groups';

import { useRequest } from '@abp/request';

export function useFeatureGroupDefinitionsApi() {
  const { cancel, request } = useRequest();

  /**
   * Xóa định nghĩa tính năng
   * @param name Tên tính năng
   */
  function deleteApi(name: string): Promise<void> {
    return request(`/api/feature-management/definitions/groups/${name}`, {
      method: 'DELETE',
    });
  }

  /**
   * Truy vấn định nghĩa tính năng
   * @param name Tên tính năng
   * @returns Đối tượng truyền dữ liệu định nghĩa tính năng
   */
  function getApi(name: string): Promise<FeatureGroupDefinitionDto> {
    return request<FeatureGroupDefinitionDto>(
      `/api/feature-management/definitions/groups/${name}`,
      {
        method: 'GET',
      },
    );
  }

  /**
   * Truy vấn danh sách định nghĩa tính năng
   * @param input Điều kiện lọc tính năng
   * @returns Danh sách đối tượng truyền dữ liệu định nghĩa tính năng
   */
  function getListApi(
    input?: FeatureGroupDefinitionGetListInput,
  ): Promise<ListResultDto<FeatureGroupDefinitionDto>> {
    return request<ListResultDto<FeatureGroupDefinitionDto>>(
      `/api/feature-management/definitions/groups`,
      {
        method: 'GET',
        params: input,
      },
    );
  }

  /**
   * Tạo định nghĩa tính năng
   * @param input Tham số định nghĩa tính năng
   * @returns Đối tượng truyền dữ liệu định nghĩa tính năng
   */
  function createApi(
    input: FeatureGroupDefinitionCreateDto,
  ): Promise<FeatureGroupDefinitionDto> {
    return request<FeatureGroupDefinitionDto>(
      '/api/feature-management/definitions/groups',
      {
        data: input,
        method: 'POST',
      },
    );
  }

  /**
   * Cập nhật định nghĩa tính năng
   * @param name Tên tính năng
   * @param input Tham số định nghĩa tính năng
   * @returns Đối tượng truyền dữ liệu định nghĩa tính năng
   */
  function updateApi(
    name: string,
    input: FeatureGroupDefinitionUpdateDto,
  ): Promise<FeatureGroupDefinitionDto> {
    return request<FeatureGroupDefinitionDto>(
      `/api/feature-management/definitions/groups/${name}`,
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
    getListApi,
    updateApi,
  };
}
