import { describe, it, expect } from '@jest/globals';
import {
  isValidHeadersJson,
  linesToArray,
  parseHeadersJson,
  parseTimeoutDuration,
  webhookDefinitionFormSchema,
  webhookGroupFormSchema,
  webhookSubscriptionFormSchema,
} from '../webhook-form-schema';

describe('webhook forms', () => {
  it('nhóm: name + displayName bắt buộc', () => {
    expect(webhookGroupFormSchema.safeParse({ name: '', displayName: 'X' }).success).toBe(false);
    expect(webhookGroupFormSchema.safeParse({ name: 'g1', displayName: '' }).success).toBe(false);
    expect(webhookGroupFormSchema.safeParse({ name: 'g1', displayName: 'Nhóm 1' }).success).toBe(
      true,
    );
  });

  it('định nghĩa: groupName + name + displayName bắt buộc', () => {
    const base = { groupName: 'g1', name: 'w1', displayName: 'W1', isEnabled: true };
    expect(webhookDefinitionFormSchema.safeParse({ ...base, groupName: '' }).success).toBe(false);
    expect(webhookDefinitionFormSchema.safeParse({ ...base, name: '' }).success).toBe(false);
    expect(webhookDefinitionFormSchema.safeParse(base).success).toBe(true);
  });

  it('đăng ký: webhookUri bắt buộc, timeout số nguyên >= 0, headers phải là JSON object', () => {
    const base = {
      webhookUri: 'https://example.com/hook',
      isActive: true,
      timeoutDuration: '',
      headers: '{}',
    };
    expect(webhookSubscriptionFormSchema.safeParse({ ...base, webhookUri: '' }).success).toBe(
      false,
    );
    expect(
      webhookSubscriptionFormSchema.safeParse({ ...base, timeoutDuration: '-1' }).success,
    ).toBe(false);
    expect(
      webhookSubscriptionFormSchema.safeParse({ ...base, timeoutDuration: '1.5' }).success,
    ).toBe(false);
    expect(
      webhookSubscriptionFormSchema.safeParse({ ...base, timeoutDuration: '30' }).success,
    ).toBe(true);
    expect(webhookSubscriptionFormSchema.safeParse({ ...base, headers: '[1,2]' }).success).toBe(
      false,
    );
    expect(webhookSubscriptionFormSchema.safeParse({ ...base, headers: '{x' }).success).toBe(false);
    expect(
      webhookSubscriptionFormSchema.safeParse({ ...base, headers: '{"X-A":"1"}' }).success,
    ).toBe(true);
  });

  it('helpers: linesToArray bỏ dòng trống; parseHeadersJson; parseTimeoutDuration', () => {
    expect(linesToArray('w1\n\n w2 \n')).toEqual(['w1', 'w2']);
    expect(linesToArray(undefined)).toEqual([]);
    expect(parseHeadersJson('{"X-A":"1"}')).toEqual({ 'X-A': '1' });
    expect(parseHeadersJson('[1]')).toBeUndefined();
    expect(isValidHeadersJson('{"a":1}')).toBe(true);
    expect(isValidHeadersJson('nope')).toBe(false);
    expect(parseTimeoutDuration('')).toBeUndefined();
    expect(parseTimeoutDuration('30')).toBe(30);
  });
});
