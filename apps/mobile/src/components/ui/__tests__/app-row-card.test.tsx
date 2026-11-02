import { Text } from 'react-native';
import { render, screen, fireEvent } from '@testing-library/react-native';
import { describe, it, expect, jest } from '@jest/globals';
import { AppRowCard } from '../AppRowCard';

describe('AppRowCard', () => {
  it('render nội dung con bên trong khung dòng', async () => {
    await render(
      <AppRowCard testID="probe-row">
        <Text>Ten dong</Text>
      </AppRowCard>,
    );
    expect(screen.getByText('Ten dong')).toBeTruthy();
    expect(screen.getByTestId('probe-row')).toBeTruthy();
  });

  it('forward onPress xuống Pressable (Link asChild clone prop tương tự)', async () => {
    const onPress = jest.fn();
    await render(
      <AppRowCard testID="probe-row" onPress={onPress}>
        <Text>Ten dong</Text>
      </AppRowCard>,
    );
    fireEvent.press(screen.getByTestId('probe-row'));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('không gọi onPress khi không truyền handler', async () => {
    await render(
      <AppRowCard testID="probe-row">
        <Text>Ten dong</Text>
      </AppRowCard>,
    );
    expect(() => fireEvent.press(screen.getByTestId('probe-row'))).not.toThrow();
  });

  it('render nhiều con (tên + mô tả + badge) không mất phần tử nào', async () => {
    await render(
      <AppRowCard testID="probe-row">
        <Text>Ten</Text>
        <Text>Mo ta</Text>
        <Text>Trang thai</Text>
      </AppRowCard>,
    );
    expect(screen.getByText('Ten')).toBeTruthy();
    expect(screen.getByText('Mo ta')).toBeTruthy();
    expect(screen.getByText('Trang thai')).toBeTruthy();
  });
});
