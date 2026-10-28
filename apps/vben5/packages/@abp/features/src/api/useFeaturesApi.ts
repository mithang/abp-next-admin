import type {
  FeatureProvider,
  GetFeatureListResultDto,
  UpdateFeaturesDto,
} from '../types/features';

import { useRequest } from '@abp/request';

export function useFeaturesApi() {
  const { cancel, request } = useRequest();

  /**
   * Xóa tính năng
   * @param {FeatureProvider} provider Tham số
   * @returns {Promise<void>}
   */
  function deleteApi(provider: FeatureProvider): Promise<void> {
    return request(`/api/feature-management/features`, {
      method: 'DELETE',
      params: provider,
    });
  }

  /**
   * Truy vấn tính năng
   * @param {FeatureProvider} provider Tham số
   * @returns {Promise<GetFeatureListResultDto>} Đối tượng truyền dữ liệu thực thể tính năng
   */
  function getApi(provider: FeatureProvider): Promise<GetFeatureListResultDto> {
    return request<GetFeatureListResultDto>(
      `/api/feature-management/features`,
      {
        method: 'GET',
        params: provider,
      },
    );
  }

  /**
   * Cập nhật tính năng
   * @param {FeatureProvider} provider
   * @param {UpdateFeaturesDto} input Tham số
   * @returns {Promise<void>}
   */
  function updateApi(
    provider: FeatureProvider,
    input: UpdateFeaturesDto,
  ): Promise<void> {
    return request(`/api/feature-management/features`, {
      data: input,
      method: 'PUT',
      params: provider,
    });
  }

  return {
    cancel,
    deleteApi,
    getApi,
    updateApi,
  };
}
