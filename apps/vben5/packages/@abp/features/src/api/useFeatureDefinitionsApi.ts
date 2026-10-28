import type { ListResultDto, NameValue } from '@abp/core';

import type {
  FeatureDefinitionCreateDto,
  FeatureDefinitionDto,
  FeatureDefinitionGetListInput,
  FeatureDefinitionUpdateDto,
} from '../types/definitions';

import { useRequest } from '@abp/request';

export function useFeatureDefinitionsApi() {
  const { cancel, request } = useRequest();

  /**
   * Xóa định nghĩa tính năng
   * @param name Tên tính năng
   */
  function deleteApi(name: string): Promise<void> {
    return request(`/api/feature-management/definitions/${name}`, {
      method: 'DELETE',
    });
  }

  /**
   * Truy vấn định nghĩa tính năng
   * @param name Tên tính năng
   * @returns Đối tượng truyền dữ liệu định nghĩa tính năng
   */
  function getApi(name: string): Promise<FeatureDefinitionDto> {
    return request<FeatureDefinitionDto>(
      `/api/feature-management/definitions/${name}`,
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
    input?: FeatureDefinitionGetListInput,
  ): Promise<ListResultDto<FeatureDefinitionDto>> {
    return request<ListResultDto<FeatureDefinitionDto>>(
      `/api/feature-management/definitions`,
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
    input: FeatureDefinitionCreateDto,
  ): Promise<FeatureDefinitionDto> {
    return request<FeatureDefinitionDto>(
      '/api/feature-management/definitions',
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
    input: FeatureDefinitionUpdateDto,
  ): Promise<FeatureDefinitionDto> {
    return request<FeatureDefinitionDto>(
      `/api/feature-management/definitions/${name}`,
      {
        data: input,
        method: 'PUT',
      },
    );
  }

  /**
   * Lấy danh sách nhà cung cấp tính năng khả dụng
   * @returns {Promise<ListResultDto<NameValue<string>>>} Danh sách nhà cung cấp tính năng
   */
  function getAssignableProvidersApi(): Promise<
    ListResultDto<NameValue<string>>
  > {
    return request<ListResultDto<NameValue<string>>>(
      '/api/feature-management/definitions/assignable-providers',
      {
        method: 'GET',
      },
    );
  }

  return {
    cancel,
    createApi,
    deleteApi,
    getApi,
    getAssignableProvidersApi,
    getListApi,
    updateApi,
  };
}
