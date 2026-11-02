import { render, screen, fireEvent } from '@testing-library/react-native';
import { describe, it, expect, jest } from '@jest/globals';
import { AppSearchInput } from '../AppSearchInput';

describe('AppSearchInput', () => {
  it('hiển thị value + placeholder và gọi onChangeText khi nhập', async () => {
    const onChangeText = jest.fn();
    await render(
      <AppSearchInput
        value="adm"
        onChangeText={onChangeText}
        placeholder="Tìm kiếm…"
        testID="probe-search"
      />,
    );
    const field = screen.getByTestId('probe-search');
    expect(field.props.value).toBe('adm');
    expect(field.props.placeholder).toBe('Tìm kiếm…');
    fireEvent.changeText(field, 'admin');
    expect(onChangeText).toHaveBeenCalledWith('admin');
  });

  it('cố định autoCapitalize "none" để chuỗi tìm kiếm không bị viết hoa', async () => {
    await render(
      <AppSearchInput
        value=""
        onChangeText={() => {}}
        placeholder="Tìm kiếm…"
        testID="probe-search"
      />,
    );
    expect(screen.getByTestId('probe-search').props.autoCapitalize).toBe('none');
  });

  it('không render nhãn: chỉ có ô nhập với placeholder đã truyền', async () => {
    await render(
      <AppSearchInput
        value=""
        onChangeText={() => {}}
        placeholder="Tìm theo tên…"
        testID="probe-search"
      />,
    );
    expect(screen.getByTestId('probe-search').props.placeholder).toBe('Tìm theo tên…');
    expect(screen.queryByText('Tìm theo tên…')).toBeNull();
  });

  it('render được khi không truyền testID', async () => {
    await render(<AppSearchInput value="x" onChangeText={() => {}} placeholder="Tìm kiếm…" />);
    expect(screen.getByPlaceholderText('Tìm kiếm…')).toBeTruthy();
  });
});
