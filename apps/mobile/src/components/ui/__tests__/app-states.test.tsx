import { describe, it, expect, jest } from '@jest/globals';
import { render, screen, fireEvent } from '@testing-library/react-native';
import '../../../i18n';
import { AppLoading, AppEmptyState, AppErrorState } from '../AppStates';

describe('AppLoading', () => {
  it('hiển thị label mặc định', async () => {
    await render(<AppLoading />);
    expect(screen.getByText('Đang tải…')).toBeTruthy();
  });

  it('hiển thị label tùy chọn', async () => {
    await render(<AppLoading label="Đang đồng bộ…" />);
    expect(screen.getByText('Đang đồng bộ…')).toBeTruthy();
  });
});

describe('AppEmptyState', () => {
  it('hiển thị message', async () => {
    await render(<AppEmptyState message="Chưa có dữ liệu" />);
    expect(screen.getByText('Chưa có dữ liệu')).toBeTruthy();
  });
});

describe('AppErrorState', () => {
  it('hiển thị message và gọi onRetry khi bấm Thử lại', async () => {
    const onRetry = jest.fn();
    await render(<AppErrorState message="Tải thất bại" onRetry={onRetry} />);
    expect(screen.getByText('Tải thất bại')).toBeTruthy();
    fireEvent.press(screen.getByText('Thử lại'));
    expect(onRetry).toHaveBeenCalledTimes(1);
  });

  it('không có nút Thử lại khi không truyền onRetry', async () => {
    await render(<AppErrorState message="Tải thất bại" />);
    expect(screen.queryByText('Thử lại')).toBeNull();
  });
});
