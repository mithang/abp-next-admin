import { render, screen } from '@testing-library/react-native';
import { describe, it, expect } from '@jest/globals';
import { Text } from '@/components/ui/text';
import { AppButtonRow } from '../AppButtonRow';

describe('AppButtonRow', () => {
  it('render hai nút verbatim như hàng chọn phạm vi WeChat', async () => {
    await render(
      <AppButtonRow>
        <Text>Global</Text>
        <Text>Tenant</Text>
      </AppButtonRow>,
    );
    expect(screen.getByText('Global')).toBeTruthy();
    expect(screen.getByText('Tenant')).toBeTruthy();
  });

  it('render một nút như hàng lưu/hủy khi chỉ có một nút', async () => {
    await render(
      <AppButtonRow>
        <Text>Luu</Text>
      </AppButtonRow>,
    );
    expect(screen.getByText('Luu')).toBeTruthy();
  });

  it('chấp nhận testID', async () => {
    await render(
      <AppButtonRow testID="hang-nut">
        <Text>Luu</Text>
      </AppButtonRow>,
    );
    expect(screen.getByTestId('hang-nut')).toBeTruthy();
  });
});
