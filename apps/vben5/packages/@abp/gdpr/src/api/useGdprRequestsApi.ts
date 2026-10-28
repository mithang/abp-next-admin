import type { PagedResultDto } from '@abp/core';

import type { GdprRequestDto, GdprRequestGetListInput } from '../types';

import { useRequest } from '@abp/request';

export function useGdprRequestsApi() {
  const { cancel, request } = useRequest();

  /**
   * Xóa yêu cầu dữ liệu cá nhân
   * @param {string} id Id yêu cầu
   * @returns {void}
   */
  function deleteApi(id: string): Promise<void> {
    return request(`/api/gdpr/requests/${id}`, {
      method: 'DELETE',
    });
  }

  /**
   * Xóa tài khoản người dùng
   * @returns {Promise<void>}
   */
  function deletePersonalAccountApi(): Promise<void> {
    return request(`/api/gdpr/requests/personal-account`, {
      method: 'DELETE',
    });
  }

  /**
   * Xóa dữ liệu người dùng
   * @returns {Promise<void>}
   */
  function deletePersonalDataApi(): Promise<void> {
    return request(`/api/gdpr/requests/personal-data`, {
      method: 'DELETE',
    });
  }

  /**
   * Chuẩn bị dữ liệu người dùng
   * @returns {Promise<void>}
   */
  function preparePersonalDataApi(): Promise<void> {
    return request(`/api/gdpr/requests/personal-data/prepare`, {
      method: 'POST',
    });
  }

  /**
   * Tải xuống dữ liệu người dùng
   * @returns {Promise<Blob>} File dữ liệu người dùng
   */
  function downloadPersonalDataApi(requestId: string): Promise<Blob> {
    return request<Blob>(
      `/api/gdpr/requests/personal-data/download/${requestId}`,
      {
        method: 'GET',
        responseType: 'blob',
      },
    );
  }

  /**
   * Truy vấn yêu cầu dữ liệu cá nhân
   * @param {string} id Id yêu cầu
   * @returns {Promise<GdprRequestDto>} Yêu cầu dữ liệu cá nhân
   */
  function getApi(id: string): Promise<GdprRequestDto> {
    return request<GdprRequestDto>(`/api/gdpr/requests/${id}`, {
      method: 'GET',
    });
  }

  /**
   * Truy vấn danh sách phân trang các yêu cầu dữ liệu cá nhân
   * @param {GdprRequestGetListInput} input Tham số
   * @returns {Promise<PagedResultDto<GdprRequestDto>>} Danh sách yêu cầu dữ liệu cá nhân
   */
  function getPagedListApi(
    input?: GdprRequestGetListInput,
  ): Promise<PagedResultDto<GdprRequestDto>> {
    return request<PagedResultDto<GdprRequestDto>>(`/api/gdpr/requests`, {
      method: 'GET',
      params: input,
    });
  }

  return {
    cancel,
    deleteApi,
    deletePersonalAccountApi,
    deletePersonalDataApi,
    downloadPersonalDataApi,
    getApi,
    getPagedListApi,
    preparePersonalDataApi,
  };
}
