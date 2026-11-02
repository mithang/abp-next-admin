import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { AppButton } from './AppButton';
import { AppEmptyState, AppErrorState, AppLoading } from './AppStates';

interface AppListProps {
  /** Mảng dữ liệu của danh sách (chỉ dùng để xét rỗng, FlatList vẫn do caller render). */
  items: readonly unknown[];
  isPending: boolean;
  isError: boolean;
  errorMessage: string;
  onRetry?: () => void;
  emptyMessage: string;
  /** FlatList của màn hình, giữ nguyên props (data/renderItem/refreshing/...) của caller. */
  children: ReactNode;
  /** Hiện nút "Tải thêm" khi true và có onLoadMore — đúng luật cũ: chỉ phụ thuộc hasMore, không phụ thuộc trạng thái tải/lỗi. */
  hasMore?: boolean;
  onLoadMore?: () => void;
  loadMoreLoading?: boolean;
}

/**
 * Khung danh sách chuẩn, thay cho khối ternary lặp lại ở ~40 màn hình:
 * pending → AppLoading, lỗi → AppErrorState (+ retry), rỗng → AppEmptyState,
 * còn lại render FlatList của caller, rồi nút "Tải thêm" khi còn trang.
 * Header (ô tìm kiếm, nút chế độ chọn, nút tạo...) và footer (nút tạo,
 * thông báo lỗi mutation) vẫn là sibling ngoài AppList, giữ nguyên thứ tự
 * hiển thị cũ — AppList chỉ chuẩn hóa phần trạng thái + danh sách + tải thêm.
 */
export function AppList({
  items,
  isPending,
  isError,
  errorMessage,
  onRetry,
  emptyMessage,
  children,
  hasMore,
  onLoadMore,
  loadMoreLoading,
}: AppListProps) {
  const { t } = useTranslation();
  return (
    <>
      {isPending ? (
        <AppLoading />
      ) : isError ? (
        <AppErrorState message={errorMessage} onRetry={onRetry} />
      ) : items.length === 0 ? (
        <AppEmptyState message={emptyMessage} />
      ) : (
        children
      )}
      {hasMore && onLoadMore ? (
        <AppButton
          title={t('common.loadMore')}
          onPress={onLoadMore}
          loading={loadMoreLoading}
          variant="outline"
          testID="app-list-load-more"
        />
      ) : null}
    </>
  );
}
