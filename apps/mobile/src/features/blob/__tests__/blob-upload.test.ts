import { describe, it, expect } from '@jest/globals';
import { BLOB_FILE_UPLOAD_PATH, buildBlobUploadForm } from '../blob-upload';
import { uploadBlobFile } from '../blob-api';

const FILE = { uri: 'file:///cache/report.pdf', name: 'report.pdf', mimeType: 'application/pdf' };

describe('buildBlobUploadForm', () => {
  it('name trim, rỗng thì dùng tên file gốc', () => {
    expect(
      buildBlobUploadForm({ containerId: 'c1', name: '  bao-cao.pdf ', file: FILE }).fields,
    ).toEqual({ containerId: 'c1', name: 'bao-cao.pdf' });
    expect(buildBlobUploadForm({ containerId: 'c1', name: '   ', file: FILE }).fields.name).toBe(
      'report.pdf',
    );
    expect(buildBlobUploadForm({ containerId: 'c1', file: FILE }).fields.name).toBe('report.pdf');
  });

  it('parentId chỉ gửi khi có (root = không gửi)', () => {
    expect(buildBlobUploadForm({ containerId: 'c1', file: FILE }).fields).not.toHaveProperty(
      'parentId',
    );
    expect(
      buildBlobUploadForm({ containerId: 'c1', parentId: 'p9', file: FILE }).fields.parentId,
    ).toBe('p9');
  });

  it('mimeType thiếu → application/octet-stream, tên file part giữ tên gốc', () => {
    const form = buildBlobUploadForm({
      containerId: 'c1',
      file: { uri: 'file:///cache/x.bin', name: 'x.bin' },
    });
    expect(form.filePart).toEqual({
      uri: 'file:///cache/x.bin',
      name: 'x.bin',
      type: 'application/octet-stream',
    });
  });
});

describe('uploadBlobFile', () => {
  function stubFetch(body: string, status = 200) {
    const calls: unknown[][] = [];
    const fn = async (...args: unknown[]) => {
      calls.push(args);
      return { ok: status >= 200 && status < 300, status, text: async () => body };
    };
    globalThis.fetch = fn as unknown as typeof fetch;
    return { calls };
  }

  it('POST multipart tới /blobs/file (single-file, không phải chunk) kèm field + file part', async () => {
    const { calls } = stubFetch(
      JSON.stringify({ id: 'b1', name: 'report.pdf', fullName: 'report.pdf', type: 1, size: 42 }),
    );
    const result = await uploadBlobFile({ containerId: 'c1', parentId: 'p9', file: FILE });
    expect(result.id).toBe('b1');
    expect(calls[0][0] as string).toContain(BLOB_FILE_UPLOAD_PATH);
    expect((calls[0][1] as { method: string }).method).toBe('POST');
    const headers = (calls[0][1] as { headers: Record<string, string> }).headers;
    expect(headers._AbpDontWrapResult).toBe('true');
    expect(headers).not.toHaveProperty('Content-Type');
    const form = (calls[0][1] as { body: FormData }).body;
    expect(form.get('containerId')).toBe('c1');
    expect(form.get('name')).toBe('report.pdf');
    expect(form.get('parentId')).toBe('p9');
    // FormData của Node stringify part không phải Blob nên chỉ assert
    // part đã append; hình dạng filePart {uri,name,type} đã kiểm ở
    // buildBlobUploadForm, còn RN xử lý part này thành file upload thật.
    expect(form.has('File')).toBe(true);
  });

  it('envelope đóng gói code 0 → trả DTO trong result', async () => {
    stubFetch(
      JSON.stringify({
        code: '0',
        message: 'OK',
        result: { id: 'b2', name: 'a.txt', fullName: 'a.txt', type: 1, size: 1 },
      }),
    );
    const result = await uploadBlobFile({ containerId: 'c1', file: FILE });
    expect(result.id).toBe('b2');
  });
});
