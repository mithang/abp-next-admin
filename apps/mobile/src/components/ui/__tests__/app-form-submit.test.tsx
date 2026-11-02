import { render, screen, fireEvent } from '@testing-library/react-native';
import { describe, it, expect, jest } from '@jest/globals';
import { AppFormSubmit } from '../AppFormSubmit';

describe('AppFormSubmit', () => {
  it('render dòng lỗi trên nút submit khi có error', async () => {
    await render(
      <AppFormSubmit error="Loi gui form" title="Luu" onPress={() => {}} testID="probe-submit" />,
    );
    expect(screen.getByText('Loi gui form')).toBeTruthy();
    expect(screen.getByText('Luu')).toBeTruthy();
  });

  it('không render dòng lỗi khi error null', async () => {
    await render(
      <AppFormSubmit error={null} title="Luu" onPress={() => {}} testID="probe-submit" />,
    );
    expect(screen.queryByText('Loi gui form')).toBeNull();
    expect(screen.getByText('Luu')).toBeTruthy();
  });

  it('forward onPress xuống nút submit', async () => {
    const onPress = jest.fn();
    await render(<AppFormSubmit title="Luu" onPress={onPress} testID="probe-submit" />);
    fireEvent.press(screen.getByTestId('probe-submit'));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('render được ở trạng thái loading mà không mất tiêu đề', async () => {
    await render(<AppFormSubmit title="Luu" loading onPress={() => {}} testID="probe-submit" />);
    expect(screen.getByText('Luu')).toBeTruthy();
  });
});
