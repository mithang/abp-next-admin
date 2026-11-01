/**
 * Menu yêu thích của tôi — bản mobile của WorkbenchQuickNav + modal
 * WorkbenchQuickNavModal web (@abp/platform, mở từ workbench/dashboard).
 *
 * Nguồn sự thật là backend, không suy đoán schema:
 * - Controller: UserFavoriteMenuController, route gốc
 *   /api/platform/menus/favorites, [Authorize] toàn controller.
 * - Route "của tôi" dùng user hiện tại, KHÔNG cần userId:
 *   GET/POST/PUT /my-favorite-menus, DELETE /my-favorite-menus/{MenuId}.
 * - Route {userId} cần quyền PlatformPermissions.Menu.ManageUserFavorites
 *   (chỉ admin quản trị) — mobile vòng này chỉ dùng route "của tôi",
 *   đúng phạm vi QuickNav web (người dùng tự quản lý menu của mình).
 * - DTO trả về (UserFavoriteMenuDto C#): menuId, userId, aliasName?,
 *   color?, framework?, name, displayName, path, icon? — KHÔNG có
 *   concurrencyStamp trong DTO trả về, dù UpdateDto yêu cầu stamp.
 *   Vì vậy web cũng KHÔNG có UI sửa favorites (QuickNav chỉ tạo + xóa):
 *   màn mobile vòng này giữ đúng parity đó — list + tạo + xóa.
 *   Hàm updateMyFavoriteMenu vẫn có ở tầng API (đã test route/body)
 *   để vòng sau dùng khi xác minh được cách lấy stamp hợp lệ.
 * - DELETE nhận MenuId (id của MENU, không phải id bản ghi favorite):
 *   service tìm bản ghi bằng FindByUserMenuAsync(userId, menuId) rồi xóa,
 *   nên UI xóa phải truyền item.menuId — truyền item.id sẽ xóa sai.
 * - Tạo trùng (cùng framework + menuId) backend ném
 *   PlatformErrorCodes.UserDuplicateFavoriteMenu: UI chặn trước bằng
 *   isDuplicateFavorite thay vì đợi lỗi server.
 * - Tạo yêu cầu framework (CreateDto bắt buộc, web lấy từ uiFramework);
 *   đọc list thì framework tùy chọn (GetListInput cho phép null).
 */

export interface UserFavoriteMenuDto {
  id: string;
  menuId: string;
  userId: string;
  aliasName?: string | null;
  color?: string | null;
  framework?: string | null;
  name: string;
  displayName: string;
  path: string;
  icon?: string | null;
}

export interface UserFavoriteMenuCreateDto {
  framework: string;
  menuId: string;
  color?: string;
  aliasName?: string;
  icon?: string;
}

export interface UserFavoriteMenuUpdateDto {
  menuId: string;
  concurrencyStamp: string;
  color?: string;
  aliasName?: string;
  icon?: string;
}

function clean(value: string | undefined | null): string | undefined {
  const trimmed = value?.trim();
  return trimmed ? trimmed : undefined;
}

/**
 * Build body tạo favorite: trim mọi chuỗi, bỏ key rỗng (đúng mẫu
 * buildUserMenuInput vòng 22). framework/menuId rỗng thì giữ nguyên
 * chuỗi rỗng để UI chặn trước khi gọi API — không tự gán mặc định.
 */
export function buildFavoriteCreateInput(input: {
  framework: string;
  menuId: string;
  color?: string;
  aliasName?: string;
  icon?: string;
}): UserFavoriteMenuCreateDto {
  return {
    framework: input.framework.trim(),
    menuId: input.menuId.trim(),
    color: clean(input.color),
    aliasName: clean(input.aliasName),
    icon: clean(input.icon),
  };
}

/** Build body sửa favorite: cùng quy tắc trim/bỏ rỗng, giữ nguyên stamp. */
export function buildFavoriteUpdateInput(input: {
  menuId: string;
  concurrencyStamp: string;
  color?: string;
  aliasName?: string;
  icon?: string;
}): UserFavoriteMenuUpdateDto {
  return {
    menuId: input.menuId.trim(),
    concurrencyStamp: input.concurrencyStamp,
    color: clean(input.color),
    aliasName: clean(input.aliasName),
    icon: clean(input.icon),
  };
}

/**
 * Chặn trùng trước khi gọi API: trùng = cùng menuId VÀ cùng framework
 * (đúng CheckExistsAsync(framework, userId, menuId) của service).
 * Framework null ở bản ghi cũ không tính là trùng với framework mới.
 */
export function isDuplicateFavorite(
  items: readonly Pick<UserFavoriteMenuDto, 'menuId' | 'framework'>[],
  menuId: string,
  framework: string,
): boolean {
  const wantedMenu = menuId.trim();
  const wantedFramework = framework.trim();
  if (!wantedMenu || !wantedFramework) return false;
  return items.some((item) => item.menuId === wantedMenu && item.framework === wantedFramework);
}

/** Tên hiển thị: alias (nếu có) thắng displayName — đúng QuickNav web. */
export function favoriteDisplayName(
  item: Pick<UserFavoriteMenuDto, 'aliasName' | 'displayName'>,
): string {
  return item.aliasName?.trim() ? (item.aliasName as string).trim() : item.displayName;
}

/** Chỉ để vẽ ô màu mẫu: backend chỉ kiểm tra độ dài color, không ép hex. */
export function isHexColor(value: string | undefined | null): boolean {
  return value != null && /^#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(value.trim());
}
