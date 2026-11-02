import { describe, expect, it } from '@jest/globals';
import { formatDateTime } from '../dates';

describe('formatDateTime', () => {
  it('formats a valid ISO string exactly like the old inline toLocaleString()', () => {
    const value = '2026-11-02T10:20:30.000Z';
    expect(formatDateTime(value)).toBe(new Date(value).toLocaleString());
  });

  it('returns undefined for null, undefined and empty string', () => {
    expect(formatDateTime(null)).toBeUndefined();
    expect(formatDateTime(undefined)).toBeUndefined();
    expect(formatDateTime('')).toBeUndefined();
  });

  it('returns undefined for an invalid date string instead of "Invalid Date"', () => {
    expect(formatDateTime('not-a-date')).toBeUndefined();
  });

  it('does NOT render the epoch for null (the old new Date(null) bug)', () => {
    // Old code: new Date(null).toLocaleString() === epoch 1970, not empty.
    expect(new Date(null as unknown as string).toLocaleString()).not.toBe('');
    expect(formatDateTime(null)).toBeUndefined();
  });

  it('accepts a Date instance', () => {
    const date = new Date('2026-01-15T08:00:00.000Z');
    expect(formatDateTime(date)).toBe(date.toLocaleString());
  });
});
