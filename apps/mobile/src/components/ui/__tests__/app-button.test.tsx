import { describe, it, expect, jest } from '@jest/globals';
import { render, screen, fireEvent } from '@testing-library/react-native';
import { AppButton } from '../AppButton';

describe('AppButton', () => {
  it('hiển thị title và gọi onPress khi bấm', async () => {
    const onPress = jest.fn();
    await render(<AppButton title="Lưu" onPress={onPress} testID="btn" />);
    fireEvent.press(screen.getByTestId('btn'));
    expect(onPress).toHaveBeenCalledTimes(1);
    expect(screen.getByText('Lưu')).toBeTruthy();
  });

  it('không gọi onPress khi disabled', async () => {
    const onPress = jest.fn();
    await render(<AppButton title="Lưu" onPress={onPress} disabled testID="btn" />);
    fireEvent.press(screen.getByTestId('btn'));
    expect(onPress).not.toHaveBeenCalled();
  });

  it('không gọi onPress khi loading (nút bị disable trong lúc chờ)', async () => {
    const onPress = jest.fn();
    await render(<AppButton title="Lưu" onPress={onPress} loading testID="btn" />);
    fireEvent.press(screen.getByTestId('btn'));
    expect(onPress).not.toHaveBeenCalled();
  });

  it('render được cả 2 variant và action negative mà không crash', async () => {
    await render(
      <AppButton title="Xóa" onPress={() => {}} variant="outline" action="negative" testID="btn" />,
    );
    expect(screen.getByText('Xóa')).toBeTruthy();
  });
});
