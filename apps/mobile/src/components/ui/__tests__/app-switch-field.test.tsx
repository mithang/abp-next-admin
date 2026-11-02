import { describe, it, expect, jest } from '@jest/globals';
import { render, screen, fireEvent } from '@testing-library/react-native';
import { AppSwitchField } from '../AppSwitchField';

describe('AppSwitchField', () => {
  it('hiển thị nhãn và switch với giá trị truyền vào', async () => {
    await render(
      <AppSwitchField label="Bật tính năng" value={true} onValueChange={() => {}} testID="sw" />,
    );
    expect(screen.getByText('Bật tính năng')).toBeTruthy();
    expect(screen.getByTestId('sw').props.value).toBe(true);
  });

  it('gọi onValueChange với giá trị mới khi đổi switch', async () => {
    const onValueChange = jest.fn();
    await render(
      <AppSwitchField
        label="Bật tính năng"
        value={false}
        onValueChange={onValueChange}
        testID="sw"
      />,
    );
    fireEvent(screen.getByTestId('sw'), 'valueChange', true);
    expect(onValueChange).toHaveBeenCalledWith(true);
  });

  it('layout stack vẫn hiển thị nhãn và switch (giữ dạng View trần cũ)', async () => {
    await render(
      <AppSwitchField
        label="Cho phép null"
        value={false}
        onValueChange={() => {}}
        layout="stack"
        testID="sw"
      />,
    );
    expect(screen.getByText('Cho phép null')).toBeTruthy();
    expect(screen.getByTestId('sw').props.value).toBe(false);
  });

  it('mặc định là row: nhãn và switch đều render, giá trị false giữ nguyên', async () => {
    await render(
      <AppSwitchField label="Công khai" value={false} onValueChange={() => {}} testID="sw" />,
    );
    expect(screen.getByText('Công khai')).toBeTruthy();
    expect(screen.getByTestId('sw').props.value).toBe(false);
  });
});
