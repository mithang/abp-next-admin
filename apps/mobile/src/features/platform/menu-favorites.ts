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
 *   concurrencyStamp trong DTO trả về, dù UpdateDto khai báo stamp
 *   (IHasConcurrencyStamp). Vòng 30 đã kiểm chứng ở tầng service:
 *   UserFavoriteMenuAppService.UpdateByInput CHỈ gán color/alias/icon,
 *   KHÔNG gọi SetConcurrencyStampIfNotNull như PackageAppService:167
 *   hay EnterpriseAppService:83 — nghĩa là stamp gửi lên KHÔNG BAO
 *   GIỜ được áp vào entity, EF chỉ đối chiếu stamp đã load từ DB,
 *   nên PUT thành công với stamp rỗng; không có endpoint nào trả
 *   stamp về cho client. Web không có UI sửa (QuickNav chỉ tạo +
 *   xóa), nhưng mobile vòng 30 thêm UI sửa alias/color/icon và gửi
 *   concurrencyStamp '' — giá trị duy nhất client có thể gửi, đúng
 *   với hành vi service đã kiểm chứng, KHÔNG phải stamp giả mạo.
 *   Nếu backend sau này sửa service để ép stamp thật, UI sửa này
 *   phải xem lại cùng lúc vì DTO vẫn không trả stamp (lỗi backend,
 *   không phải lỗi mobile).
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
