/**
 * Trợ giúp chọn nhiều dùng chung cho các màn list (mẫu đã có ở màn Cache):
 * toggle trả về Set mới thay vì mutate Set cũ, để React nhận state mới.
 * Dùng cho Tác vụ nền (bulk pause/resume/trigger/stop/start/delete);
 * các màn khác có thể chuyển sang dùng chung dần mà không đổi hành vi.
 */
export function toggleSelection<T>(prev: ReadonlySet<T>, id: T): Set<T> {
  const next = new Set(prev);
  if (next.has(id)) next.delete(id);
  else next.add(id);
  return next;
}

export function selectAll<T>(ids: Iterable<T>): Set<T> {
  return new Set(ids);
}
