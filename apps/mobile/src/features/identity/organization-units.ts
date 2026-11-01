/** DTO khớp backend ABP: xem apps/vben5/packages/@abp/identity/src/types/organization-units.ts
 * và API web apps/vben5/packages/@abp/identity/src/api/useOrganizationUnitsApi.ts.
 * Web hiển thị cây (OrganizationUnitTree): gốc từ /root-node, con từ /find-children.
 * Mobile lấy toàn bộ cây bằng một lần gọi /all rồi dựng cây ở client — tránh
 * N+1 request cho mỗi nút, phù hợp danh sách đơn vị thường nhỏ. */
export interface OrganizationUnitDto {
  id: string;
  code: string;
  displayName: string;
  parentId?: string;
  creationTime?: string;
  creatorId?: string;
  lastModificationTime?: string;
}

export interface GetOrganizationUnitPagedListInput {
  skipCount?: number;
  maxResultCount?: number;
  sorting?: string;
  filter?: string;
}

export interface OrganizationUnitCreateInput {
  displayName: string;
  parentId?: string;
}

export interface OrganizationUnitUpdateInput {
  displayName: string;
}

export interface FlattenedOrganizationUnit {
  unit: OrganizationUnitDto;
  depth: number;
}

/**
 * Trải cây thành danh sách theo thứ tự duyệt sâu (DFS), giữ thứ tự backend trả về
 * trong từng cấp. Đơn vị mồ côi (parentId không có trong danh sách) được coi là gốc.
 * Chống vòng lặp parent: một nút đã thăm không được duyệt lại, độ sâu tối đa 50.
 */
export function flattenOrganizationUnits(units: OrganizationUnitDto[]): FlattenedOrganizationUnit[] {
  const byParent = new Map<string | undefined, OrganizationUnitDto[]>();
  for (const unit of units) {
    const key = units.some((u) => u.id === unit.parentId) ? unit.parentId : undefined;
    const list = byParent.get(key) ?? [];
    list.push(unit);
    byParent.set(key, list);
  }
  const result: FlattenedOrganizationUnit[] = [];
  const visited = new Set<string>();
  const walk = (parentId: string | undefined, depth: number) => {
    if (depth > 50) return;
    for (const unit of byParent.get(parentId) ?? []) {
      if (visited.has(unit.id)) continue;
      visited.add(unit.id);
      result.push({ unit, depth });
      walk(unit.id, depth + 1);
    }
  };
  walk(undefined, 0);
  // Nút còn sót (ví dụ vòng lặp parent kín không chạm được từ gốc) vẫn phải hiện.
  for (const unit of units) {
    if (!visited.has(unit.id)) result.push({ unit, depth: 0 });
  }
  return result;
}

/** Tìm tên đơn vị cha để hiển thị ở màn hình chi tiết; thiếu thì trả undefined. */
export function findOrganizationUnitName(units: OrganizationUnitDto[], parentId?: string): string | undefined {
  if (!parentId) return undefined;
  return units.find((u) => u.id === parentId)?.displayName;
}
