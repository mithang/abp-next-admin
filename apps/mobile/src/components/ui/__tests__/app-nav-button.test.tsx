import { describe, it, expect, jest } from '@jest/globals';
import { render, screen, fireEvent } from '@testing-library/react-native';
import { AppNavButton } from '../AppNavButton';

const mockPush = jest.fn();
jest.mock('expo-router', () => ({
  useRouter: () => ({ push: mockPush }),
}));

describe('AppNavButton', () => {
  it('hien thi title va goi router.push(href) khi bam', async () => {
    mockPush.mockClear();
    await render(
      <AppNavButton
        title="Sua vai tro"
        href="/roles/form?id=1"
        variant="outline"
        testID="nav-btn"
      />,
    );
    expect(screen.getByText('Sua vai tro')).toBeTruthy();
    fireEvent.press(screen.getByTestId('nav-btn'));
    expect(mockPush).toHaveBeenCalledTimes(1);
    expect(mockPush).toHaveBeenCalledWith('/roles/form?id=1');
  });
});
