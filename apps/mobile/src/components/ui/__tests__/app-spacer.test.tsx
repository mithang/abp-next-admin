import { render, screen } from '@testing-library/react-native';
import { describe, it, expect } from '@jest/globals';
import { Text } from '@/components/ui/text';
import { AppSpacer } from '../AppSpacer';

describe('AppSpacer', () => {
  it('render không crash khi đứng một mình như trước AppList', async () => {
    await render(<AppSpacer />);
    expect(screen).toBeTruthy();
  });

  it('render cùng children xung quanh như màn danh sách', async () => {
    await render(
      <>
        <Text>Bo loc</Text>
        <AppSpacer />
        <Text>Danh sach</Text>
      </>,
    );
    expect(screen.getByText('Bo loc')).toBeTruthy();
    expect(screen.getByText('Danh sach')).toBeTruthy();
  });

  it('chấp nhận height tùy chỉnh', async () => {
    await render(<AppSpacer height={16} />);
    expect(screen).toBeTruthy();
  });
});
