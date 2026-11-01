import { describe, it, expect } from '@jest/globals';
import {
  backgroundJobBaseFromForm,
  backgroundJobFormDefaults,
  backgroundJobFormSchema,
} from '../task-form-schema';

const validCreate = {
  ...backgroundJobFormDefaults,
  name: 'cleanup',
  group: 'system',
  type: 'CleanupJob',
  beginTime: '2026-11-01T00:00:00',
  jobType: '1',
  priority: '15',
};

describe('background job forms', () => {
  it('tạo: bắt name/group/type/beginTime/jobType/priority', () => {
    expect(backgroundJobFormSchema(false).safeParse(validCreate).success).toBe(true);
    expect(backgroundJobFormSchema(false).safeParse({ ...validCreate, name: '' }).success).toBe(false);
    expect(backgroundJobFormSchema(false).safeParse({ ...validCreate, group: '' }).success).toBe(false);
    expect(backgroundJobFormSchema(false).safeParse({ ...validCreate, type: '' }).success).toBe(false);
    expect(backgroundJobFormSchema(false).safeParse({ ...validCreate, beginTime: '' }).success).toBe(false);
    expect(backgroundJobFormSchema(false).safeParse({ ...validCreate, beginTime: 'not-a-date' }).success).toBe(false);
    expect(backgroundJobFormSchema(false).safeParse({ ...validCreate, jobType: '' }).success).toBe(false);
    expect(backgroundJobFormSchema(false).safeParse({ ...validCreate, priority: '' }).success).toBe(false);
  });

  it('sửa: không bắt các field chỉ có ở CreateDto', () => {
    const edit = { ...backgroundJobFormDefaults, jobType: '0', priority: '25' };
    expect(backgroundJobFormSchema(true).safeParse(edit).success).toBe(true);
  });

  it('chặn jobType/priority ngoài enum và số không nguyên/âm', () => {
    expect(backgroundJobFormSchema(false).safeParse({ ...validCreate, jobType: '3' }).success).toBe(false);
    expect(backgroundJobFormSchema(false).safeParse({ ...validCreate, priority: '99' }).success).toBe(false);
    expect(backgroundJobFormSchema(false).safeParse({ ...validCreate, interval: '-1' }).success).toBe(false);
    expect(backgroundJobFormSchema(false).safeParse({ ...validCreate, interval: '1.5' }).success).toBe(false);
    expect(backgroundJobFormSchema(false).safeParse({ ...validCreate, interval: 'abc' }).success).toBe(false);
  });

  it('args phải là JSON object; mảng/chuỗi thô bị chặn', () => {
    expect(backgroundJobFormSchema(false).safeParse({ ...validCreate, args: '{"a":1}' }).success).toBe(true);
    expect(backgroundJobFormSchema(false).safeParse({ ...validCreate, args: '[1,2]' }).success).toBe(false);
    expect(backgroundJobFormSchema(false).safeParse({ ...validCreate, args: '{bad' }).success).toBe(false);
  });

  it('baseFromForm parse số + args đúng', () => {
    const base = backgroundJobBaseFromForm({ ...validCreate, args: '{"a":1}', interval: '600' });
    expect(base).toMatchObject({ jobType: 1, priority: 15, interval: 600, args: { a: 1 } });
  });
});
