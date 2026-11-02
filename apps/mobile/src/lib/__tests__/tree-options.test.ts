import { describe, it, expect } from '@jest/globals';
import { orderTreeItems } from '../tree-options';

const items = [
  { id: 'root-b', parentId: null },
  { id: 'root-a', parentId: null },
  { id: 'a1', parentId: 'root-a' },
  { id: 'a1x', parentId: 'a1' },
  { id: 'a2', parentId: 'root-a' },
];

describe('orderTreeItems', () => {
  it('duyệt cha trước con, giữ thứ tự gốc, kèm depth', () => {
    const ordered = orderTreeItems(items);
    expect(ordered.map((o) => `${o.item.id}:${o.depth}`)).toEqual([
      'root-b:0',
      'root-a:0',
      'a1:1',
      'a1x:2',
      'a2:1',
    ]);
  });

  it('mục mồ côi (cha không có trong danh sách) thành gốc', () => {
    const ordered = orderTreeItems([...items, { id: 'orphan', parentId: 'missing' }]);
    expect(ordered.at(-1)).toEqual({ item: { id: 'orphan', parentId: 'missing' }, depth: 0 });
    expect(ordered).toHaveLength(6);
  });

  it('chu trình parentId không lặp vô hạn và không mất mục', () => {
    const cyclic = [
      { id: 'x', parentId: 'y' },
      { id: 'y', parentId: 'x' },
    ];
    const ordered = orderTreeItems(cyclic);
    expect(ordered.map((o) => o.item.id).sort()).toEqual(['x', 'y']);
    expect(ordered).toHaveLength(2);
  });

  it('danh sách rỗng trả về rỗng', () => {
    expect(orderTreeItems([])).toEqual([]);
  });
});
