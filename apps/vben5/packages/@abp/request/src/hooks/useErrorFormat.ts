import type { RemoteServiceErrorInfo } from '@abp/core';
import type { AxiosResponse } from 'axios';

export function useErrorFormat(response: AxiosResponse) {
  const _defaultErrorHeaderKey: string = '_abperrorformat';
  const { data, headers } = response;
  /** Có phải lỗi yêu cầu hay không */
  function hasError(): boolean {
    if (
      typeof headers.has === 'function' &&
      headers.has(_defaultErrorHeaderKey)
    ) {
      return String(headers[_defaultErrorHeaderKey]).includes('true');
    }
    return false;
  }
  /** Nếu yêu cầu bị lỗi, ném ngoại lệ */
  function throwIfError(): void {
    if (!hasError()) return;
    throw Object.assign({}, response, { message: getErrorMessage(), response });
  }

  /** Lấy thông báo lỗi */
  function getErrorMessage(): string | undefined {
    if (!hasError()) return undefined;
    const errorJson = data.error as RemoteServiceErrorInfo;
    let errorMessage = errorJson.message;
    if (errorJson.validationErrors) {
      errorMessage += errorJson.validationErrors
        .map((error) => error.message)
        .join('\n');
    }
    return errorMessage;
  }

  return {
    hasError,
    getErrorMessage,
    throwIfError,
  };
}
