import { describe, it, expect, jest } from '@jest/globals';
import { render, screen, fireEvent } from '@testing-library/react-native';
import { FlatList, Text } from 'react-native';
import '../../../i18n';
import { AppList } from '../AppList';

const items = [
  { id: '1', label: 'Mục một' },
  { id: '2', label: 'Mục hai' },
];

function renderList(props: Partial<Parameters<typeof AppList>[0]> = {}) {
  return render(
    <AppList
      items={items}
      isPending={false}
      isError={false}
      errorMessage="Lỗi tải"
      emptyMessage="Trống"
      {...props}
    >
      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <Text>{item.label}</Text>}
      />
    </AppList>,
  );
}

describe('AppList', () => {
  it('đang tải thì hiện trạng thái tải, không render danh sách', async () => {
    await renderList({ isPending: true });
    expect(screen.getByText('Đang tải…')).toBeTruthy();
    expect(screen.queryByText('Mục một')).toBeNull();
  });

  it('lỗi thì hiện thông báo và nút thử lại gọi onRetry', async () => {
    const onRetry = jest.fn();
    await renderList({ isError: true, onRetry });
    expect(screen.getByText('Lỗi tải')).toBeTruthy();
    expect(screen.queryByText('Mục một')).toBeNull();
    fireEvent.press(screen.getByText('Thử lại'));
    expect(onRetry).toHaveBeenCalledTimes(1);
  });

  it('rỗng thì hiện thông báo trống, không render danh sách', async () => {
    await renderList({ items: [] });
    expect(screen.getByText('Trống')).toBeTruthy();
    expect(screen.queryByText('Mục một')).toBeNull();
  });

  it('có dữ liệu thì render FlatList của caller và không hiện nút tải thêm khi hết trang', async () => {
    await renderList({ hasMore: false, onLoadMore: () => {} });
    expect(screen.getByText('Mục một')).toBeTruthy();
    expect(screen.getByText('Mục hai')).toBeTruthy();
    expect(screen.queryByTestId('app-list-load-more')).toBeNull();
  });

  it('còn trang thì hiện nút tải thêm và bấm gọi onLoadMore', async () => {
    const onLoadMore = jest.fn();
    await renderList({ hasMore: true, onLoadMore });
    fireEvent.press(screen.getByTestId('app-list-load-more'));
    expect(onLoadMore).toHaveBeenCalledTimes(1);
  });

  it('không có onLoadMore thì không hiện nút tải thêm dù hasMore', async () => {
    await renderList({ hasMore: true });
    expect(screen.queryByTestId('app-list-load-more')).toBeNull();
  });
});
