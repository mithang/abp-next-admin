import { describe, it, expect } from '@jest/globals';
import { render, screen } from '@testing-library/react-native';
import { Text } from 'react-native';
import { AppScreen } from '../AppScreen';

describe('AppScreen', () => {
  it('hiển thị tiêu đề, phụ đề và nội dung ở dạng mặc định (không cuộn)', async () => {
    await render(
      <AppScreen title="Tiêu đề màn hình" subtitle="Phụ đề">
        <Text>Nội dung màn hình</Text>
      </AppScreen>,
    );
    expect(screen.getByText('Tiêu đề màn hình')).toBeTruthy();
    expect(screen.getByText('Phụ đề')).toBeTruthy();
    expect(screen.getByText('Nội dung màn hình')).toBeTruthy();
    expect(screen.queryByTestId('app-screen-scroll-view')).toBeNull();
  });

  it('dạng scrollable bọc nội dung trong ScrollView để form/detail dài cuộn được', async () => {
    await render(
      <AppScreen title="Form dài" scrollable>
        <Text>Field cuối form</Text>
      </AppScreen>,
    );
    expect(screen.getByText('Form dài')).toBeTruthy();
    expect(screen.getByText('Field cuối form')).toBeTruthy();
    expect(screen.getByTestId('app-screen-scroll-view')).toBeTruthy();
  });

  it('không hiển thị tiêu đề/phụ đề khi không truyền', async () => {
    await render(
      <AppScreen scrollable>
        <Text>Chỉ nội dung</Text>
      </AppScreen>,
    );
    expect(screen.getByText('Chỉ nội dung')).toBeTruthy();
    expect(screen.getByTestId('app-screen-scroll-view')).toBeTruthy();
  });
});
