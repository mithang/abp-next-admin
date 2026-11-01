import { describe, expect, it } from '@jest/globals';
import {
  buildRoleMenuInput,
  buildUserMenuInput,
  coerceStartupMenuId,
  flattenMenuTree,
  normalizeFramework,
  resolveAllotInitial,
} from '../menu-allotment';
import type { MenuDto } from '../types';

function menu(partial: Partial<MenuDto> & { id: string }): MenuDto {
  return {
    path: '/x',
    name: 'x',
    displayName: 'X',
    code: 'X',
    component: 'C',
    framework: 'Vben',
    parentId: null,
    layoutId: 'layout-1',
    isPublic: false,
    startup: false,
    ...partial,
  };
}

describe('flattenMenuTree', () => {
  it('trải cây theo parentId, thụt lề theo độ sâu, mồ côi về gốc', () => {
    const rows = flattenMenuTree([
      menu({ id: 'child', parentId: 'root' }),
      menu({ id: 'root' }),
      menu({ id: 'orphan', parentId: 'missing' }),
      menu({ id: 'grand', parentId: 'child' }),
    ]);
    expect(rows.map((r) => [r.item.id, r.depth])).toEqual([
      ['root', 0],
      ['child', 1],
      ['grand', 2],
      ['orphan', 0],
    ]);
  });

  it('không lặp vô hạn khi cây có chu trình', () => {
    const rows = flattenMenuTree([
      menu({ id: 'a', parentId: 'b' }),
      menu({ id: 'b', parentId: 'a' }),
    ]);
    expect(rows).toEqual([]);
  });
});

describe('resolveAllotInitial', () => {
  it('menuIds khử trùng, startup lấy từ menu startup=true', () => {
    const { menuIds, startupMenuId } = resolveAllotInitial([
      menu({ id: 'm1' }),
      menu({ id: 'm2', startup: true }),
      menu({ id: 'm1' }),
    ]);
    expect(menuIds).toEqual(['m1', 'm2']);
    expect(startupMenuId).toBe('m2');
  });

  it('không có startup thì trả null', () => {
    expect(resolveAllotInitial([menu({ id: 'm1' })])).toEqual({
      menuIds: ['m1'],
      startupMenuId: null,
    });
  });
});

describe('buildUserMenuInput / buildRoleMenuInput', () => {
  it('trim framework, khử trùng menuIds, startup null → bỏ key', () => {
    expect(
      buildUserMenuInput({
        userId: 'u1',
        framework: '  Vben  ',
        menuIds: ['m1', 'm2', 'm1'],
        startupMenuId: null,
      }),
    ).toEqual({ userId: 'u1', framework: 'Vben', menuIds: ['m1', 'm2'] });
  });

  it('framework rỗng → bỏ key; roleName được trim', () => {
    expect(
      buildRoleMenuInput({
        roleName: '  Admin ',
        framework: '   ',
        menuIds: [],
        startupMenuId: 'm9',
      }),
    ).toEqual({ roleName: 'Admin', startupMenuId: 'm9', menuIds: [] });
  });
});

describe('normalizeFramework / coerceStartupMenuId', () => {
  it('framework rỗng sau trim → undefined', () => {
    expect(normalizeFramework('   ')).toBeUndefined();
    expect(normalizeFramework(' Vben ')).toBe('Vben');
  });

  it('startup ngoài selection → null; trong selection → giữ nguyên', () => {
    expect(coerceStartupMenuId('m1', new Set(['m2']))).toBeNull();
    expect(coerceStartupMenuId('m1', new Set(['m1', 'm2']))).toBe('m1');
    expect(coerceStartupMenuId(null, new Set(['m1']))).toBeNull();
  });
});
