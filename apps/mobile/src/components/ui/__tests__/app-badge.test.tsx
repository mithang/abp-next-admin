import { render, screen } from '@testing-library/react-native';
import { describe, it, expect } from '@jest/globals';
import { AppBadge } from '../AppBadge';

describe('AppBadge', () => {
  it('render nhãn mặc định (variant default)', async () => {
    await render(<AppBadge label="Hoat dong" />);
    expect(screen.getByText('Hoat dong')).toBeTruthy();
  });

  it('render nhãn với variant destructive', async () => {
    await render(<AppBadge label="Bi khoa" variant="destructive" />);
    expect(screen.getByText('Bi khoa')).toBeTruthy();
  });

  it('render nhãn là biểu thức điều kiện như điểm gọi users', async () => {
    const isActive = false;
    await render(
      <AppBadge
        label={isActive ? 'Hoat dong' : 'Khong hoat dong'}
        variant={isActive ? 'default' : 'destructive'}
      />,
    );
    expect(screen.getByText('Khong hoat dong')).toBeTruthy();
  });

  it('render nhãn ghép từ nhiều biểu thức như điểm gọi claim-types detail', async () => {
    const required = true;
    const isStatic = true;
    await render(
      <AppBadge
        label={
          <>
            {required ? 'Bat buoc' : 'Tuy chon'}
            {isStatic ? ' · Tinh' : ''}
          </>
        }
      />,
    );
    expect(screen.getByText('Bat buoc · Tinh')).toBeTruthy();
  });
});
