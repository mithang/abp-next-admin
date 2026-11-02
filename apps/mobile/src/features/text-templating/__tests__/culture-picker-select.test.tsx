import { describe, it, expect, jest } from '@jest/globals';
import { render, screen, fireEvent } from '@testing-library/react-native';
import '../../../i18n';
import { AppSelect } from '../../../components/ui/AppSelect';
import { buildCulturePickerOptions } from '../culture-options';
import type { LanguageDto } from '../../localization/types';

/**
 * Hợp đồng nối màn nội dung mẫu văn bản (vòng 33) với AppSelect:
 * options do buildCulturePickerOptions tạo phải cắm thẳng vào AppSelect
 * mà không cần chuyển dạng — lựa chọn mặc định ('') hiển thị nhãn mặc
 * định, chọn một ngôn ngữ gọi onChange đúng cultureName, và culture
 * nhập tay ngoài danh sách vẫn hiển thị đúng giá trị (fallback preset
 * của AppSelect) thay vì trống như danh sách Pressable thô trước đó.
 */
function options() {
  const languages: LanguageDto[] = [
    { cultureName: 'vi', displayName: 'Tiếng Việt' },
    { cultureName: 'en', displayName: 'English' },
  ];
  return buildCulturePickerOptions(languages, 'Mặc định');
}

describe('culture picker qua AppSelect', () => {
  it('hiển thị nhãn mặc định khi culture đang chọn là rỗng', async () => {
    await render(
      <AppSelect
        label="Culture"
        value=""
        options={options()}
        onChange={jest.fn()}
        testID="culture"
      />,
    );
    expect(screen.getByText('Mặc định')).toBeTruthy();
  });

  it('mở danh sách, chọn ngôn ngữ gọi onChange đúng cultureName', async () => {
    const onChange = jest.fn();
    await render(
      <AppSelect
        label="Culture"
        value=""
        options={options()}
        onChange={onChange}
        testID="culture"
      />,
    );
    fireEvent.press(screen.getByTestId('culture-field'));
    await screen.findByText('Tiếng Việt (vi)');
    fireEvent.press(screen.getByTestId('culture-option-vi'));
    expect(onChange).toHaveBeenCalledWith('vi');
  });

  it('culture nhập tay ngoài danh sách vẫn hiển thị đúng giá trị', async () => {
    await render(
      <AppSelect
        label="Culture"
        value="fr"
        options={options()}
        onChange={jest.fn()}
        testID="culture"
      />,
    );
    expect(screen.getByText('fr')).toBeTruthy();
  });
});
