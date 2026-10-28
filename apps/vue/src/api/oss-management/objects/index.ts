import { defHttp } from '/@/utils/http/axios';
import {
  OssObject,
  OssObjectCreate,
  OssObjectBulkDelete,
  OssObjectsResult,
  GetOssObjectRequest,
  GetOssObjectPagedRequest,
} from './model';
import { AxiosResponse } from 'axios';
import { isFunction } from '/@/utils/is';
import { UploadFileParams } from '/#/axios';
import { useAbpStoreWithOut } from '/@/store/modules/abp';
import { format } from '/@/utils/strings';
import { ContentTypeEnum } from '/@/enums/httpEnum';

export const uploadUrl = '/api/oss-management/objects/upload';
export const downloadUrl = '/api/files/static/{bucket}/p/{path}/{name}';

export function generateOssUrl(bucket: string, path: string, object: string) {
  if (path) {
    // Mã hóa URL cho phần Path
    path = encodeURIComponent(path);
    if (path !== '.%2F' && path.endsWith('%2F')) {
      path = path.substring(0, path.length - 3);
    }
  }
  return format(downloadUrl, { bucket: bucket, path: path, name: object });
}

export const downloadBlob = (bucket: string, path: string, object: string) => {
  return defHttp.get<Blob>({
    url: generateOssUrl(bucket, path, object),
    headers: {
      accept: 'application/json',
    },
    responseType: 'blob',
  });
};

/**
 * Tải lên tệp theo từng phần
 * @param params Tham số tệp
 * @param event Tham số sự kiện
 * @returns Phản hồi sau khi tải lên thành công
 */
export const uploadObject = (params: UploadFileParams, event: any) => {
  // Kích thước khối thông thường
  const chunkSize: number = params.chunkSize ?? 2 * 1024 * 1024;
  // Tổng số khối
  const totalChunks = Math.ceil(params.file.size / chunkSize);
  // Tổng kích thước
  const totalSize = params.file.size;
  // Tên tệp
  const fileName = params.filename ?? (params.file as File).name;
  // Kích thước đã hoàn thành
  let loadedSize = 0;
  // Trả về kết quả đã đóng gói
  return new Promise<AxiosResponse<any>>(async (resolve, reject) => {
    function onPregress(progress: number, res: AxiosResponse) {
      // Callback tiến độ tải lên
      if (isFunction(event)) {
        event({
          loaded: progress,
          total: totalSize,
        });
      }
      if (progress === totalSize) {
        if (!res.data) {
          let formatUrl = '/api/files/static/{bucket}/p/{path}/{name}';
          const abpStore = useAbpStoreWithOut();
          const { currentTenant } = abpStore.getApplication;
          if (currentTenant.id) {
            formatUrl = '/api/files/static/t/{tenantId}/{bucket}/p/{path}/{name}';
          }
          const path = encodeURIComponent(params.data?.path);
          res.data = {
            url: format(formatUrl, {
              bucket: params.data?.bucket,
              tenantId: currentTenant.id,
              path: path,
              name: fileName,
            }),
          };
        }
        resolve(res);
      }
    }
    function uploadFunc(num: number) {
      // Tính chỉ số phần
      const nextSize = Math.min(num * chunkSize, params.file.size);
      // Cắt tệp
      const fileData = params.file.slice((num - 1) * chunkSize, nextSize);
      // Kích thước phần hiện tại
      const currentChunksSize = fileData.size;
      const requestConfig = {
        url: uploadUrl,
        // Đặt thời gian chờ dài
        timeout: 600000,
      };
      const requestData = {
        file: fileData,
        chunkNumber: num,
        chunkSize: chunkSize,
        currentChunkSize: currentChunksSize,
        totalChunks: totalChunks,
        totalSize: totalSize,
        bucket: params.data?.bucket,
        path: params.data?.path,
        fileName: fileName,
      };
      return defHttp
        .uploadFile(requestConfig, {
          data: requestData,
          file: fileData,
        })
        .then((res) => {
          // Tiến độ hiện tại
          loadedSize += currentChunksSize;
          onPregress(loadedSize, res);
          return Promise.resolve(res);
        })
        .catch((error) => {
          return Promise.reject(error);
        });
    }
    // TODO: Hỗ trợ tải lên nhiều tệp phần trong một lần
    for (let num = 1; num <= totalChunks; num++) {
      try {
        // Tải lên phần đầu tiên theo cách đồng bộ, nếu xảy ra lỗi thì các phần khác sẽ không tải lên nữa
        const res = await uploadFunc(num);
        onPregress(loadedSize, res);
      } catch (error) {
        return reject(error);
      }
    }
  });
};

export const createObject = (input: OssObjectCreate, file?: Blob) => {
  const formData = new window.FormData();
  formData.append('bucket', input.bucket);
  formData.append('path', input.path);
  formData.append('fileName', input.object);
  formData.append('overwrite', String(input.overwrite));
  input.expirationTime && formData.append('expirationTime', input.expirationTime.toString());
  file && formData.append('file', file);
  return defHttp.post<OssObject>({
    url: '/api/oss-management/objects',
    headers: {
      'Content-type': ContentTypeEnum.FORM_DATA,
    },
    data: formData,
  });
};

export const deleteObject = (input: GetOssObjectRequest) => {
  return defHttp.delete<void>({
    url: '/api/oss-management/objects',
    params: input,
  });
};

export const bulkDeleteObject = (input: OssObjectBulkDelete) => {
  return defHttp.post<void>({
    url: '/api/oss-management/objects/bulk-delete',
    data: input,
  });
};

export const getObject = (input: GetOssObjectRequest) => {
  return defHttp.get<OssObject>({
    url: '/api/oss-management/objects',
    params: input,
  });
};

export const getObjects = (input: GetOssObjectPagedRequest) => {
  return defHttp.get<OssObjectsResult>({
    url: '/api/oss-management/containes/objects',
    params: input,
  });
};
