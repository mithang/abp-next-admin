import { render, screen } from '@testing-library/react-native';
import { describe, it, expect } from '@jest/globals';
import { Text } from '@/components/ui/text';
import { AppSectionCard } from '../AppSectionCard';

describe('AppSectionCard', () => {
  it('render một children text như thẻ cài đặt hệ thống', async () => {
    await render(
      <AppSectionCard>
        <Text>Ten cai dat</Text>
      </AppSectionCard>,
    );
    expect(screen.getByText('Ten cai dat')).toBeTruthy();
  });

  it('render nhiều children verbatim như thẻ tính năng tenant', async () => {
    await render(
      <AppSectionCard>
        <Text>Tinh nang A</Text>
        <Text>Mo ta A</Text>
      </AppSectionCard>,
    );
    expect(screen.getByText('Tinh nang A')).toBeTruthy();
    expect(screen.getByText('Mo ta A')).toBeTruthy();
  });

  it('render children lồng nhau như thẻ WeChat có mô tả + điều khiển', async () => {
    await render(
      <AppSectionCard>
        <Text>WeChat login</Text>
        <Text>Mo ta</Text>
      </AppSectionCard>,
    );
    expect(screen.getByText('WeChat login')).toBeTruthy();
    expect(screen.getByText('Mo ta')).toBeTruthy();
  });

  it('render không crash khi không có children', async () => {
    await render(<AppSectionCard>{null}</AppSectionCard>);
    expect(screen).toBeTruthy();
  });
});
