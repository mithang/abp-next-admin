import { describe, it, expect, jest } from '@jest/globals';
import { render, screen, fireEvent, waitFor } from '@testing-library/react-native';
import '../../../i18n';
import { AppSelect, type AppSelectOption } from '../AppSelect';

const OPTIONS: AppSelectOption[] = [
  { value: 'vue', label: 'Vue' },
  { value: 'react', label: 'React', depth: 1 },
  { value: 'angular', label: 'Angular', disabled: true },
];

async function renderSelect(props: Partial<React.ComponentProps<typeof AppSelect>> = {}) {
  const onChange = jest.fn();
  await render(
    <AppSelect
      label="Framework"
      value=""
      options={OPTIONS}
      onChange={onChange}
      placeholder="Chọn framework…"
      testID="fw"
      {...props}
    />,
  );
  return { onChange };
}

describe('AppSelect', () => {
  it('đóng mặc định: hiện placeholder, chưa hiện option', async () => {
    await renderSelect();
    expect(screen.getByText('Chọn framework…')).toBeTruthy();
    expect(screen.queryByText('Vue')).toBeNull();
  });

  it('bấm field mở danh sách, bấm option gọi onChange và đóng', async () => {
    const { onChange } = await renderSelect();
    fireEvent.press(screen.getByTestId('fw-field'));
    await screen.findByText('Vue');
    fireEvent.press(screen.getByTestId('fw-option-react'));
    expect(onChange).toHaveBeenCalledWith('react');
    await waitFor(() => {
      expect(screen.queryByText('Vue')).toBeNull();
    });
  });

  it('hiển thị label của giá trị đang chọn', async () => {
    await renderSelect({ value: 'react' });
    expect(screen.getByText('React')).toBeTruthy();
  });

  it('giá trị không có trong options vẫn hiển thị đúng value (preset ngoài trang)', async () => {
    await renderSelect({ value: '11111111-2222-3333-4444-555555555555' });
    expect(screen.getByText('11111111-2222-3333-4444-555555555555')).toBeTruthy();
  });

  it('tìm kiếm lọc theo label và value', async () => {
    await renderSelect();
    fireEvent.press(screen.getByTestId('fw-field'));
    await screen.findByText('Vue');
    fireEvent.changeText(screen.getByTestId('fw-search'), 'vu');
    await waitFor(() => {
      expect(screen.queryByText('React')).toBeNull();
    });
    expect(screen.getByText('Vue')).toBeTruthy();
  });

  it('không có kết quả tìm kiếm hiện empty text', async () => {
    await renderSelect();
    fireEvent.press(screen.getByTestId('fw-field'));
    await screen.findByText('Vue');
    fireEvent.changeText(screen.getByTestId('fw-search'), 'zzz-khong-co');
    await screen.findByText('Không tìm thấy lựa chọn nào.');
  });

  it('option disabled không gọi onChange', async () => {
    const { onChange } = await renderSelect();
    fireEvent.press(screen.getByTestId('fw-field'));
    await screen.findByText('Vue');
    fireEvent.press(screen.getByTestId('fw-option-angular'));
    expect(onChange).not.toHaveBeenCalled();
  });

  it('nút xóa (clearable) gọi onChange với chuỗi rỗng', async () => {
    const { onChange } = await renderSelect({ value: 'vue', clearable: true });
    fireEvent.press(screen.getByTestId('fw-clear'));
    expect(onChange).toHaveBeenCalledWith('');
  });

  it('field disabled không mở danh sách', async () => {
    await renderSelect({ disabled: true });
    fireEvent.press(screen.getByTestId('fw-field'));
    expect(screen.queryByText('Vue')).toBeNull();
  });

  it('option cây thụt lề theo depth (12 + depth*16)', async () => {
    await renderSelect();
    fireEvent.press(screen.getByTestId('fw-field'));
    const text = await screen.findByText('React');
    expect(text.props.style).toMatchObject({ paddingLeft: 28 });
    expect(screen.getByText('Vue').props.style).toMatchObject({ paddingLeft: 12 });
  });
});
