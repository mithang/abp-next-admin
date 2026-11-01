import { describe, it, expect } from '@jest/globals';
import { blobContainerFormSchema, blobFolderFormSchema } from '../blob-form-schema';

describe('blob forms', () => {
  it('container: name bắt buộc', () => {
    expect(blobContainerFormSchema.safeParse({ name: '' }).success).toBe(false);
    expect(blobContainerFormSchema.safeParse({ name: '  files  ' }).success).toBe(true);
  });

  it('thư mục: name bắt buộc', () => {
    expect(blobFolderFormSchema.safeParse({ name: '' }).success).toBe(false);
    expect(blobFolderFormSchema.safeParse({ name: 'docs' }).success).toBe(true);
  });
});
