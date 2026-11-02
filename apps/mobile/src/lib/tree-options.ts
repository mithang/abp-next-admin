/**
 * Sắp xếp danh sách phẳng có parentId thành thứ tự duyệt cây (cha trước
 * con, theo đúng thứ tự gốc), kèm độ sâu từng mục — dùng cho AppSelect
 * hiển thị cây (từ điển dataId, menu parentId) mà backend chỉ trả
 * danh sách phẳng qua /all.
 *
 * An toàn với dữ liệu lệch: mục mồ côi (cha không có trong danh sách)
 * được coi là gốc; chu trình parentId (A cha B, B cha A) không gây lặp
 * vô hạn nhờ tập visited — các mục còn lại sau vòng duyệt được gắn
 * tiếp ở cuối với depth 0. Thứ tự anh em giữ nguyên thứ tự đầu vào.
 */
export interface TreeItem {
  id: string;
  parentId?: string | null;
}

export interface OrderedTreeItem<T> {
  item: T;
  depth: number;
}

export function orderTreeItems<T extends TreeItem>(items: readonly T[]): OrderedTreeItem<T>[] {
  const byId = new Map<string, T>();
  for (const item of items) {
    if (!byId.has(item.id)) byId.set(item.id, item);
  }
  const children = new Map<string | null, T[]>();
  for (const item of items) {
    const parent = item.parentId && byId.has(item.parentId) ? item.parentId : null;
    const list = children.get(parent) ?? [];
    list.push(item);
    children.set(parent, list);
  }
  const ordered: OrderedTreeItem<T>[] = [];
  const visited = new Set<string>();
  const walk = (parent: string | null, depth: number) => {
    for (const child of children.get(parent) ?? []) {
      if (visited.has(child.id)) continue;
      visited.add(child.id);
      ordered.push({ item: child, depth });
      walk(child.id, depth + 1);
    }
  };
  walk(null, 0);
  // Chu trình hoặc mục không tới được từ gốc: gắn cuối ở depth 0 thay
  // vì làm mất dữ liệu (user vẫn chọn được, chỉ không thụt lề).
  for (const item of items) {
    if (!visited.has(item.id)) {
      visited.add(item.id);
      ordered.push({ item, depth: 0 });
    }
  }
  return ordered;
}
