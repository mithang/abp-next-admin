import { describe, it, expect } from '@jest/globals';
import { selectAll, toggleSelection } from '../selection';

describe('selection (chọn nhiều cho bulk UI)', () => {
  it('toggle thêm id chưa có, không mutate Set cũ', () => {
    const prev = new Set(['a']);
    const next = toggleSelection(prev, 'b');
    expect([...next].sort()).toEqual(['a', 'b']);
    expect([...prev]).toEqual(['a']);
  });

  it('toggle bỏ id đã có', () => {
    expect([...toggleSelection(new Set(['a', 'b']), 'a')]).toEqual(['b']);
  });

  it('toggle trên Set rỗng rồi toggle lại về rỗng', () => {
    expect(toggleSelection(toggleSelection(new Set<string>(), 'x'), 'x').size).toBe(0);
  });

  it('selectAll lấy đúng ids của trang hiện tại', () => {
    expect([...selectAll(['a', 'b', 'a'])].sort()).toEqual(['a', 'b']);
  });
});
