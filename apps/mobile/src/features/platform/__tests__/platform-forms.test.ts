import { describe, it, expect } from '@jest/globals';
import { dataFormSchema, dataItemFormSchema, dataMoveFormSchema } from '../data-form-schema';
import { layoutFormSchema } from '../layout-form-schema';

describe('platform forms', () => {
  it('data form: name/displayName bắt buộc; parentId sai Guid bị chặn', () => {
    expect(dataFormSchema().safeParse({ name: '', displayName: 'X', parentId: '' }).success).toBe(false);
    expect(dataFormSchema().safeParse({ name: 'ui', displayName: 'UI', parentId: 'not-a-guid' }).success).toBe(false);
    expect(
      dataFormSchema().safeParse({ name: 'ui', displayName: 'UI', parentId: '11111111-1111-1111-1111-111111111111' }).success,
    ).toBe(true);
  });

  it('data item form: valueType chỉ 0–5 (Object=6 bị chặn như modal web); allowBeNull=false thì defaultValue bắt buộc', () => {
    const base = { name: 'theme', displayName: 'Theme', defaultValue: '', allowBeNull: true, description: '' };
    expect(dataItemFormSchema().safeParse({ ...base, valueType: '6' }).success).toBe(false);
    expect(dataItemFormSchema().safeParse({ ...base, valueType: '0', allowBeNull: false }).success).toBe(false);
    expect(dataItemFormSchema().safeParse({ ...base, valueType: '0', allowBeNull: false, defaultValue: 'dark' }).success).toBe(true);
  });

  it('data item form: defaultValue kiểm chứng theo kiểu (Number/Boolean/Date)', () => {
    const base = { name: 'n', displayName: 'N', allowBeNull: true, description: '' };
    expect(dataItemFormSchema().safeParse({ ...base, valueType: '1', defaultValue: 'abc' }).success).toBe(false);
    expect(dataItemFormSchema().safeParse({ ...base, valueType: '1', defaultValue: '42' }).success).toBe(true);
    expect(dataItemFormSchema().safeParse({ ...base, valueType: '2', defaultValue: 'yes' }).success).toBe(false);
    expect(dataItemFormSchema().safeParse({ ...base, valueType: '2', defaultValue: 'true' }).success).toBe(true);
    expect(dataItemFormSchema().safeParse({ ...base, valueType: '3', defaultValue: 'not-a-date' }).success).toBe(false);
    expect(dataItemFormSchema().safeParse({ ...base, valueType: '3', defaultValue: '2026-11-01' }).success).toBe(true);
  });

  it('data move form: parentId rỗng = về gốc được chấp nhận; Guid sai bị chặn', () => {
    expect(dataMoveFormSchema().safeParse({ parentId: '' }).success).toBe(true);
    expect(dataMoveFormSchema().safeParse({ parentId: 'x' }).success).toBe(false);
  });

  it('layout form: tạo bắt buộc dataId + framework; sửa không bắt 2 field này', () => {
    const base = { name: 'main', displayName: 'Main', path: '/main', redirect: '', description: '', dataId: '', framework: '' };
    expect(layoutFormSchema(true).safeParse(base).success).toBe(false);
    expect(
      layoutFormSchema(true).safeParse({ ...base, dataId: '11111111-1111-1111-1111-111111111111', framework: 'vben' }).success,
    ).toBe(true);
    expect(layoutFormSchema(false).safeParse(base).success).toBe(true);
    expect(layoutFormSchema(false).safeParse({ ...base, path: '' }).success).toBe(false);
  });
});
