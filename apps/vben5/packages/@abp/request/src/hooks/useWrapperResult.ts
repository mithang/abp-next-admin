import type { AxiosResponse } from 'axios';

import { useErrorFormat } from './useErrorFormat';

export function useWrapperResult(response: AxiosResponse) {
  const {
    hasError: hasAbpError,
    getErrorMessage: getAbpErrorMessage,
    throwIfError: throwIfAbpError,
  } = useErrorFormat(response);
  const _defaultWrapperHeaderKey: string = '_abpwrapresult';
  const { data, headers } = response;

  /** Có phải lỗi request hay không */
  function hasError(): boolean {
    if (hasAbpError()) return true;
    return Reflect.has(data, 'code') && data.code !== '0';
  }

  /** Kết quả đã được đóng gói hay chưa */
  function hasWrapResult(): boolean {
    if (
      typeof headers.has === 'function' &&
      headers.has(_defaultWrapperHeaderKey)
    ) {
      return String(headers[_defaultWrapperHeaderKey]).includes('true');
    }
    return hasAbpError();
  }

  /** Lấy kết quả đã đóng gói */
  function getData(): any {
    throwIfError();
    return data.result;
  }

  /** Nếu request bị lỗi, ném ngoại lệ */
  function throwIfError(): void {
    throwIfAbpError();
    if (hasError()) {
      const content = data.details || data.message;
      throw Object.assign({}, response, {
        response: {
          ...response,
          data: {
            ...response.data,
            message: content,
          },
        },
      });
    }
  }

  /** Lấy thông báo lỗi */
  function getErrorMessage(): string | undefined {
    if (!hasWrapResult()) return undefined;
    const errorMessage = getAbpErrorMessage();
    if (errorMessage) return errorMessage;
    if (!hasError()) return undefined;
    return data.message;
  }

  return {
    getData,
    getErrorMessage,
    hasError,
    hasWrapResult,
  };
}
