import { describe, it, expect } from '@jest/globals';
import { buildCulturePickerOptions, isCultureInOptions } from '../culture-options';
import type { LanguageDto } from '../../localization/types';

function lang(cultureName: string, displayName: string): LanguageDto {
  return { cultureName, displayName };
}

describe('culture picker options', () => {
  it('luôn có lựa chọn mặc định đầu tiên, kể cả khi không có ngôn ngữ nào', () => {
    expect(buildCulturePickerOptions([], 'Mặc định')).toEqual([{ value: '', label: 'Mặc định' }]);
  });

  it('sắp xếp theo cultureName, nhãn dạng displayName (cultureName)', () => {
    const options = buildCulturePickerOptions(
      [lang('vi', 'Tiếng Việt'), lang('en', 'English')],
      'Mặc định',
    );
    expect(options).toEqual([
      { value: '', label: 'Mặc định' },
      { value: 'en', label: 'English (en)' },
      { value: 'vi', label: 'Tiếng Việt (vi)' },
    ]);
  });

  it('khử trùng cultureName, bỏ qua culture rỗng, trim khoảng trắng', () => {
    const options = buildCulturePickerOptions(
      [lang(' vi ', 'Tiếng Việt'), lang('vi', 'Tiếng Việt 2'), lang('   ', 'Rỗng')],
      'Mặc định',
    );
    expect(options).toEqual([
      { value: '', label: 'Mặc định' },
      { value: 'vi', label: 'Tiếng Việt (vi)' },
    ]);
  });

  it('displayName rỗng hoặc trùng cultureName thì nhãn chỉ là cultureName', () => {
    const options = buildCulturePickerOptions([lang('en', ''), lang('fr', 'fr')], 'Mặc định');
    expect(options.map((o) => o.label)).toEqual(['Mặc định', 'en', 'fr']);
  });

  it('isCultureInOptions: mặc định và culture trong danh sách là hợp lệ, culture tự nhập ngoài danh sách là không', () => {
    const options = buildCulturePickerOptions([lang('vi', 'Tiếng Việt')], 'Mặc định');
    expect(isCultureInOptions('', options)).toBe(true);
    expect(isCultureInOptions('vi', options)).toBe(true);
    expect(isCultureInOptions('zh-Hans', options)).toBe(false);
  });
});
