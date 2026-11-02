import { describe, it, expect } from '@jest/globals';
import {
  buildDataValueTypeOptions,
  buildEditionOptions,
  buildEmailStatusOptions,
  parseEmailStatusFilter,
} from '../app-select-options';

const fakeT = (key: string) =>
  ({
    'platformEmailMessages.statusPending': 'Chua gui',
    'platformEmailMessages.statusSent': 'Da gui',
    'platformEmailMessages.statusFailed': 'Gui that bai',
  })[key] ?? key;

describe('buildEditionOptions', () => {
  it('map id/displayName thanh value/label "ten — id"', () => {
    expect(
      buildEditionOptions([
        { id: '11111111-2222-3333-4444-555555555555', displayName: 'Standard' },
        { id: '22222222-3333-4444-5555-666666666666', displayName: 'Pro' },
      ]),
    ).toEqual([
      {
        value: '11111111-2222-3333-4444-555555555555',
        label: 'Standard — 11111111-2222-3333-4444-555555555555',
      },
      {
        value: '22222222-3333-4444-5555-666666666666',
        label: 'Pro — 22222222-3333-4444-5555-666666666666',
      },
    ]);
  });

  it('danh sach rong tra ve mang rong', () => {
    expect(buildEditionOptions([])).toEqual([]);
  });
});

describe('buildDataValueTypeOptions', () => {
  it('chi 0–5, label khop DATA_VALUE_TYPE_LABELS, loai Object=6', () => {
    const options = buildDataValueTypeOptions();
    expect(options.map((o) => o.value)).toEqual(['0', '1', '2', '3', '4', '5']);
    expect(options.map((o) => o.label)).toEqual([
      'String',
      'Number',
      'Boolean',
      'Date',
      'DateTime',
      'Array',
    ]);
  });
});

describe('buildEmailStatusOptions', () => {
  it('dung thu tu -1/0/10 voi label i18n', () => {
    expect(buildEmailStatusOptions(fakeT)).toEqual([
      { value: '-1', label: 'Chua gui' },
      { value: '0', label: 'Da gui' },
      { value: '10', label: 'Gui that bai' },
    ]);
  });
});

describe('parseEmailStatusFilter', () => {
  it("'' = tat ca, -1/0/10 thanh so, gia tri la tra undefined", () => {
    expect(parseEmailStatusFilter('')).toBeUndefined();
    expect(parseEmailStatusFilter('-1')).toBe(-1);
    expect(parseEmailStatusFilter('0')).toBe(0);
    expect(parseEmailStatusFilter('10')).toBe(10);
    expect(parseEmailStatusFilter('5')).toBeUndefined();
    expect(parseEmailStatusFilter('abc')).toBeUndefined();
    expect(parseEmailStatusFilter(' 0 ')).toBe(0);
  });
});
