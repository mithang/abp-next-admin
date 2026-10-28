import type { RequestClient } from '../request-client';
import type { RequestClientConfig } from '../types';

type DownloadRequestConfig = {
  /**
   * Định nghĩa kiểu dữ liệu mong muốn nhận được.
   * raw: AxiosResponse gốc, bao gồm headers, status, v.v.
   * body: Chỉ trả về phần BODY của dữ liệu phản hồi (Blob)
   */
  responseReturn?: 'body' | 'raw';
} & Omit<RequestClientConfig, 'responseReturn'>;

class FileDownloader {
  private client: RequestClient;

  constructor(client: RequestClient) {
    this.client = client;
  }
  /**
   * Tải xuống tệp
   * @param url Liên kết đầy đủ của tệp
   * @param config Thông tin cấu hình, tùy chọn.
   * @returns Nếu config.responseReturn là 'body' thì trả về Blob (mặc định), ngược lại trả về RequestResponse<Blob>
   */
  public async download<T = Blob>(
    url: string,
    config?: DownloadRequestConfig,
  ): Promise<T> {
    const finalConfig: DownloadRequestConfig = {
      responseReturn: 'body',
      method: 'GET',
      ...config,
      responseType: 'blob',
    };

    // Prefer a generic request if available; otherwise, dispatch to method-specific calls.
    const method = (finalConfig.method || 'GET').toUpperCase();
    const clientAny = this.client as any;

    if (typeof clientAny.request === 'function') {
      return await clientAny.request(url, finalConfig);
    }
    const lower = method.toLowerCase();

    if (typeof clientAny[lower] === 'function') {
      if (['POST', 'PUT'].includes(method)) {
        const { data, ...rest } = finalConfig as Record<string, any>;
        return await clientAny[lower](url, data, rest);
      }

      return await clientAny[lower](url, finalConfig);
    }

    throw new Error(
      `RequestClient does not support method "${method}". Please ensure the method is properly implemented in your RequestClient instance.`,
    );
  }
}

export { FileDownloader };
