import type { MenuDto } from './types';

/**
 * Phân bổ menu cho user/role — bản mobile của MenuAllotModal web
 * (@abp/platform, mở từ bảng Người dùng / Vai trò).
 *
 * Backend (MenuController, đã kiểm chứng từ source):
 * - GET /api/platform/menus/by-user/{userId}/{framework} → menu đã gán
 *   (mục startup mang startup=true; overload query-string by-user cần
 *   thêm Roles nên màn này dùng overload path, backend tự resolve role).
 * - GET /api/platform/menus/by-role/{role}/{framework} → tương tự.
 * - PUT /api/platform/menus/by-user { userId, framework, startupMenuId, menuIds }
 * - PUT /api/platform/menus/by-role { roleName, framework, startupMenuId, menuIds }
 * Backend lưu 2 bước: gán menu rồi gán startup riêng (MenuAppService),
 * nên startupMenuId không bắt buộc phải nằm trong menuIds — nhưng màn
 * này vẫn mặc định startup từ menu đã gán (đúng web) và chỉ cho chọn
 * startup trong số menu đã tick, để không tạo trạng thái startup trỏ
 * tới menu chưa được gán.
 */

export type MenuAllotSubject = 'user' | 'role';

export interface UserMenuInput {
  userId: string;
  framework?: string;
  startupMenuId?: string;
  menuIds: string[];
}

export interface RoleMenuInput {
  roleName: string;
  framework?: string;
  startupMenuId?: string;
  menuIds: string[];
}

/** Trải cây menu phẳng có thụt lề theo parentId (cùng thuật toán màn Menus). */
export function flattenMenuTree(items: MenuDto[]): { item: MenuDto; depth: number }[] {
  const children = new Map<string | null, MenuDto[]>();
  const ids = new Set(items.map((i) => i.id));
  for (const item of items) {
    const parent = item.parentId && ids.has(item.parentId) ? item.parentId : null;
    const list = children.get(parent) ?? [];
    list.push(item);
    children.set(parent, list);
  }
  const out: { item: MenuDto; depth: number }[] = [];
  const visit = (parent: string | null, depth: number, seen: Set<string>) => {
    for (const item of children.get(parent) ?? []) {
      if (seen.has(item.id)) continue;
      seen.add(item.id);
      out.push({ item, depth });
      visit(item.id, depth + 1, seen);
    }
  };
  visit(null, 0, new Set());
  return out;
}

/**
 * Trạng thái khởi tạo từ menu đã gán: menuIds = id các menu đã gán
 * (khử trùng, giữ thứ tự trả về); startup = menu đầu tiên có
 * startup=true, nếu không có thì null. Màn hình sau đó dùng
 * coerceStartupMenuId để chỉ giữ startup nằm trong menu đã tick:
 * trạng thái lệch (startup trỏ tới menu chưa gán) rơi về null khi lưu,
 * thay vì gửi startup mà UI không biểu diễn được.
 */
export function resolveAllotInitial(assigned: MenuDto[]): {
  menuIds: string[];
  startupMenuId: string | null;
} {
  const menuIds: string[] = [];
  const seen = new Set<string>();
  for (const menu of assigned) {
    if (!seen.has(menu.id)) {
      seen.add(menu.id);
      menuIds.push(menu.id);
    }
  }
  const startup = assigned.find((menu) => menu.startup);
  return { menuIds, startupMenuId: startup ? startup.id : null };
}

/** Chuẩn hoá framework: trim, rỗng → undefined (không gửi lên API). */
export function normalizeFramework(framework: string): string | undefined {
  const value = framework.trim();
  return value ? value : undefined;
}

/** Khử trùng menuIds, giữ thứ tự chọn; startup rỗng → undefined. */
export function buildUserMenuInput(input: {
  userId: string;
  framework: string;
  menuIds: Iterable<string>;
  startupMenuId: string | null;
}): UserMenuInput {
  const framework = normalizeFramework(input.framework);
  return {
    userId: input.userId,
    ...(framework ? { framework } : {}),
    ...(input.startupMenuId ? { startupMenuId: input.startupMenuId } : {}),
    menuIds: [...new Set(input.menuIds)],
  };
}

export function buildRoleMenuInput(input: {
  roleName: string;
  framework: string;
  menuIds: Iterable<string>;
  startupMenuId: string | null;
}): RoleMenuInput {
  const framework = normalizeFramework(input.framework);
  return {
    roleName: input.roleName.trim(),
    ...(framework ? { framework } : {}),
    ...(input.startupMenuId ? { startupMenuId: input.startupMenuId } : {}),
    menuIds: [...new Set(input.menuIds)],
  };
}

/**
 * Startup chỉ hợp lệ khi nằm trong menu đã tick; nếu user bỏ tick menu
 * đang là startup, startup tự rơi về null (tránh gửi startup trỏ tới
 * menu chưa gán — xem ghi chú đầu file).
 */
export function coerceStartupMenuId(
  startupMenuId: string | null,
  selected: ReadonlySet<string>,
): string | null {
  if (!startupMenuId) return null;
  return selected.has(startupMenuId) ? startupMenuId : null;
}
