import { describe, it, expect } from '@jest/globals';
import {
  buildFavoriteCreateInput,
  buildFavoriteUpdateInput,
  favoriteDisplayName,
  isDuplicateFavorite,
  isHexColor,
} from '../menu-favorites';

describe('menu favorites helpers', () => {
  it('build create: trim + bỏ key rỗng, giữ framework/menuId', () => {
    expect(
      buildFavoriteCreateInput({
        framework: '  Vben ',
        menuId: ' m1 ',
        color: '  ',
        aliasName: ' Trang chính ',
        icon: '',
      }),
    ).toEqual({ framework: 'Vben', menuId: 'm1', aliasName: 'Trang chính' });
  });

  it('build update: giữ nguyên stamp, trim/bỏ rỗng các field còn lại', () => {
    expect(
      buildFavoriteUpdateInput({
        menuId: ' m1 ',
        concurrencyStamp: 'stamp-1',
        color: '#000000',
        aliasName: ' ',
        icon: ' home ',
      }),
    ).toEqual({ menuId: 'm1', concurrencyStamp: 'stamp-1', color: '#000000', icon: 'home' });
  });

  it('duplicate: cùng menuId + cùng framework mới là trùng', () => {
    const items = [{ menuId: 'm1', framework: 'Vben' }];
    expect(isDuplicateFavorite(items, 'm1', 'Vben')).toBe(true);
    expect(isDuplicateFavorite(items, 'm1', 'Other')).toBe(false);
    expect(isDuplicateFavorite(items, 'm2', 'Vben')).toBe(false);
    expect(isDuplicateFavorite(items, 'm1', '')).toBe(false);
  });

  it('duplicate: framework null ở bản ghi cũ không trùng framework mới', () => {
    expect(isDuplicateFavorite([{ menuId: 'm1', framework: null }], 'm1', 'Vben')).toBe(false);
  });

  it('display name: alias thắng displayName, alias rỗng thì fallback', () => {
    expect(favoriteDisplayName({ aliasName: 'Chính', displayName: 'Dashboard' })).toBe('Chính');
    expect(favoriteDisplayName({ aliasName: '  ', displayName: 'Dashboard' })).toBe('Dashboard');
    expect(favoriteDisplayName({ displayName: 'Dashboard' })).toBe('Dashboard');
  });

  it('hex color: chỉ nhận #RGB / #RRGGBB để vẽ swatch', () => {
    expect(isHexColor('#000000')).toBe(true);
    expect(isHexColor('#abc')).toBe(true);
    expect(isHexColor('red')).toBe(false);
    expect(isHexColor('#12345')).toBe(false);
    expect(isHexColor(null)).toBe(false);
    expect(isHexColor(undefined)).toBe(false);
  });
});
