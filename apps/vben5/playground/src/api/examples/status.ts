import { requestClient } from '#/api/request';

/**
 * Mô phỏng mã trạng thái bất kỳ
 */
async function getMockStatusApi(status: string) {
  return requestClient.get('/status', { params: { status } });
}

export { getMockStatusApi };
