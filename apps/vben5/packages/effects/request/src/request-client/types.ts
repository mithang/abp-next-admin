import type {
  AxiosRequestConfig,
  AxiosResponse,
  CreateAxiosDefaults,
  InternalAxiosRequestConfig,
} from 'axios';

type ExtendOptions<T = any> = {
  /**
   * Cách tuần tự hóa tham số. Các giá trị có sẵn
   * - brackets: ids[]=1&ids[]=2&ids[]=3
   * - comma: ids=1,2,3
   * - indices: ids[0]=1&ids[1]=2&ids[2]=3
   * - repeat: ids=1&ids=2&ids=3
   */
  paramsSerializer?:
    | 'brackets'
    | 'comma'
    | 'indices'
    | 'repeat'
    | AxiosRequestConfig<T>['paramsSerializer'];
  /**
   * Cách trả về dữ liệu phản hồi.
   * - raw: AxiosResponse gốc, bao gồm headers, status, v.v., không kiểm tra yêu cầu có thành công hay không.
   * - body: Trả về phần BODY của dữ liệu phản hồi (chỉ kiểm tra yêu cầu có thành công hay không dựa theo status, bỏ qua việc phán đoán code, trong trường hợp này bên gọi nên tự kiểm tra yêu cầu có thành công hay không).
   * - data: Destructuring dữ liệu BODY của phản hồi, chỉ trả về dữ liệu nút data trong đó (sẽ kiểm tra status và code có ở trạng thái thành công hay không).
   */
  responseReturn?: 'body' | 'data' | 'raw';
};
type RequestClientConfig<T = any> = AxiosRequestConfig<T> & ExtendOptions<T>;

type RequestResponse<T = any> = AxiosResponse<T> & {
  config: RequestClientConfig<T>;
};

type RequestContentType =
  | 'application/json;charset=utf-8'
  | 'application/octet-stream;charset=utf-8'
  | 'application/x-www-form-urlencoded;charset=utf-8'
  | 'multipart/form-data;charset=utf-8';

type RequestClientOptions = CreateAxiosDefaults & ExtendOptions;

/**
 * Tùy chọn yêu cầu SSE
 */
interface SseRequestOptions extends RequestInit {
  onMessage?: (message: string) => void;
  onEnd?: () => void;
}

interface RequestInterceptorConfig {
  fulfilled?: (
    config: ExtendOptions & InternalAxiosRequestConfig,
  ) =>
    | (ExtendOptions & InternalAxiosRequestConfig<any>)
    | Promise<ExtendOptions & InternalAxiosRequestConfig<any>>;
  rejected?: (error: any) => any;
}

interface ResponseInterceptorConfig<T = any> {
  fulfilled?: (
    response: RequestResponse<T>,
  ) => Promise<RequestResponse> | RequestResponse;
  rejected?: (error: any) => any;
}

type MakeErrorMessageFn = (message: string, error: any) => void;

interface HttpResponse<T = any> {
  /**
   * 0 nghĩa là thành công, các giá trị khác nghĩa là thất bại
   * 0 means success, others means fail
   */
  code: number;
  data: T;
  message: string;
}

export type {
  HttpResponse,
  MakeErrorMessageFn,
  RequestClientConfig,
  RequestClientOptions,
  RequestContentType,
  RequestInterceptorConfig,
  RequestResponse,
  ResponseInterceptorConfig,
  SseRequestOptions,
};
