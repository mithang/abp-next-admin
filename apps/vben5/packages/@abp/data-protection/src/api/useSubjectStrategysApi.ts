import type {
  SubjectStrategyDto,
  SubjectStrategyGetInput,
  SubjectStrategySetInput,
} from '../types';

import { useRequest } from '@abp/request';

export function useSubjectStrategysApi() {
  const { cancel, request } = useRequest();

  /**
   * Lấy chính sách quyền dữ liệu của chủ thể
   * @param input Tham số
   * @returns Cấu hình chính sách quyền dữ liệu
   */
  function getApi(
    input: SubjectStrategyGetInput,
  ): Promise<null | SubjectStrategyDto> {
    return request<null | SubjectStrategyDto>(
      '/api/data-protection-management/subject-strategys',
      {
        method: 'GET',
        params: input,
      },
    );
  }

  /**
   * Thiết lập chính sách quyền dữ liệu của chủ thể
   * @param input Tham số
   * @returns Cấu hình chính sách quyền dữ liệu
   */
  function setApi(input: SubjectStrategySetInput): Promise<SubjectStrategyDto> {
    return request<SubjectStrategyDto>(
      '/api/data-protection-management/subject-strategys',
      {
        data: input,
        method: 'PUT',
      },
    );
  }

  return {
    cancel,
    getApi,
    setApi,
  };
}
