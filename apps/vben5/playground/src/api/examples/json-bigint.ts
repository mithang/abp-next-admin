import { requestClient } from '#/api/request';

/**
 * Gửi yêu cầu
 */
async function getBigIntData() {
  return requestClient.get('/demo/bigint');
}

export { getBigIntData };
