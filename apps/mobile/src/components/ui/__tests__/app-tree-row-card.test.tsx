import { fireEvent, render, screen } from '@testing-library/react-native';
import { describe, it, expect, jest } from '@jest/globals';
import { Text } from '@/components/ui/text';
import { AppTreeRowCard } from '../AppTreeRowCard';

describe('AppTreeRowCard', () => {
  it('render children với thụt lề margin mặc định (depth 2)', async () => {
    await render(
      <AppTreeRowCard depth={2}>
        <Text>Menu con</Text>
      </AppTreeRowCard>,
    );
    expect(screen.getByText('Menu con')).toBeTruthy();
  });

  it('render children với thụt lề padding như organization-units (depth 1, indent 20)', async () => {
    await render(
      <AppTreeRowCard depth={1} indent={20} indentStyle="padding">
        <Text>Don vi con</Text>
      </AppTreeRowCard>,
    );
    expect(screen.getByText('Don vi con')).toBeTruthy();
  });

  it('forward onPress xuống Pressable như điểm gọi menu-favorites', async () => {
    const onPress = jest.fn();
    await render(
      <AppTreeRowCard depth={0} onPress={onPress}>
        <Text>Chon menu</Text>
      </AppTreeRowCard>,
    );
    fireEvent.press(screen.getByText('Chon menu'));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('render ở depth 0 không thụt lề và không crash', async () => {
    await render(
      <AppTreeRowCard depth={0}>
        <Text>Goc cay</Text>
      </AppTreeRowCard>,
    );
    expect(screen.getByText('Goc cay')).toBeTruthy();
  });
});
