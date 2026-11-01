import { describe, it, expect } from '@jest/globals';
import {
  createBlobContainer,
  createBlobFolder,
  deleteBlob,
  deleteBlobContainer,
  generateBlobDownloadUrl,
  generateBlobPreviewUrl,
  getBlob,
  getBlobContainer,
  getBlobContainersPaged,
  getBlobsPaged,
} from '../blob-api';

function stubFetch(body: string, status = 200) {
  const calls: unknown[][] = [];
  const fn = async (...args: unknown[]) => {
    calls.push(args);
    return { ok: status >= 200 && status < 300, status, text: async () => body };
  };
  globalThis.fetch = fn as unknown as typeof fetch;
  return { calls };
}

function urlOf(calls: unknown[][], index = 0) {
  return calls[index][0] as string;
}

function methodOf(calls: unknown[][], index = 0) {
  return (calls[index][1] as { method: string }).method;
}

function bodyOf(calls: unknown[][], index = 0) {
  return JSON.parse((calls[index][1] as { body: string }).body) as Record<string, unknown>;
}


describe('blob containers api', () => {
  it('paged list gắn filter + phân trang ABP', async () => {
    const { calls } = stubFetch(JSON.stringify({ totalCount: 1, items: [{ id: 'c1', name: 'files' }] }));
    const result = await getBlobContainersPaged({ filter: 'fil', skipCount: 20, maxResultCount: 20 });
    expect(urlOf(calls)).toContain('/api/blob-management/containers?');
    expect(urlOf(calls)).toContain('filter=fil');
    expect(urlOf(calls)).toContain('skipCount=20');
    expect(result.totalCount).toBe(1);
  });

  it('create chỉ gửi name; không có update (backend không có Update)', async () => {
    const { calls } = stubFetch(JSON.stringify({ id: 'c1', name: 'files' }));
    await createBlobContainer({ name: 'files' });
    expect(methodOf(calls)).toBe('POST');
    expect(bodyOf(calls)).toEqual({ name: 'files' });
  });

  it('get + delete đúng route', async () => {
    const { calls } = stubFetch(JSON.stringify({ id: 'c1', name: 'files' }));
    await getBlobContainer('c1');
    expect(urlOf(calls)).toContain('/api/blob-management/containers/c1');
    const del = stubFetch('', 204);
    await deleteBlobContainer('c1');
    expect(methodOf(del.calls)).toBe('DELETE');
  });
});

describe('blobs api', () => {
  it('paged list bắt buộc containerId + parentId/type', async () => {
    const { calls } = stubFetch(JSON.stringify({ totalCount: 0, items: [] }));
    await getBlobsPaged({ containerId: 'c1', parentId: 'p1', type: 0 });
    expect(urlOf(calls)).toContain('containerId=c1');
    expect(urlOf(calls)).toContain('parentId=p1');
    expect(urlOf(calls)).toContain('type=0');
  });

  it('create folder gửi containerId + name + parentId; get/delete/generate-url đúng route', async () => {
    const { calls } = stubFetch(JSON.stringify({ id: 'b1', name: 'docs' }));
    await createBlobFolder({ containerId: 'c1', name: 'docs', parentId: 'p1' });
    expect(urlOf(calls)).toContain('/api/blob-management/blobs/folder');
    expect(bodyOf(calls)).toEqual({ containerId: 'c1', name: 'docs', parentId: 'p1' });

    const get = stubFetch(JSON.stringify({ id: 'b1', name: 'docs' }));
    await getBlob('b1');
    expect(urlOf(get.calls)).toContain('/api/blob-management/blobs/b1');

    const dl = stubFetch(JSON.stringify('https://example.test/dl'));
    const url = await generateBlobDownloadUrl('b1');
    expect(urlOf(dl.calls)).toContain('/api/blob-management/blobs/generate/download-url/b1');
    expect(url).toBe('https://example.test/dl');

    const pv = stubFetch(JSON.stringify('https://example.test/pv'));
    await generateBlobPreviewUrl('b1');
    expect(urlOf(pv.calls)).toContain('/api/blob-management/blobs/generate/preview-url/b1');

    const del = stubFetch('', 204);
    await deleteBlob('b1');
    expect(methodOf(del.calls)).toBe('DELETE');
  });
});
