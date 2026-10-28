import type { AuditedEntityDto, PagedAndSortedResultRequestDto } from "#/abp-core";

import type { GetUserPagedListInput } from "./user";

/** Tổ chức */
interface OrganizationUnitDto extends AuditedEntityDto<string> {
	/** Mã số */
	code: string;
	/** Tên hiển thị */
	displayName: string;
	/** Id nút cha */
	parentId?: string;
}

/** Đối tượng truy vấn phân trang tổ chức */
interface GetOrganizationUnitPagedListInput extends PagedAndSortedResultRequestDto {
	/** Ký tự lọc */
	filter?: string;
}

/** Đối tượng tạo tổ chức */
interface OrganizationUnitCreateDto {
	/** Tên hiển thị */
	displayName: string;
	/** Id nút cha */
	parentId?: string;
}

/** Đối tượng thay đổi tổ chức */
interface OrganizationUnitUpdateDto {
	/** Tên hiển thị */
	displayName: string;
}

/** Đối tượng thêm phòng ban cho tổ chức */
interface OrganizationUnitAddRoleInput {
	/** Danh sách id vai trò */
	roleIds: string[];
}

/** Đối tượng thêm người dùng cho tổ chức */
interface OrganizationUnitAddUserInput {
	/** Danh sách id người dùng */
	userIds: string[];
}

interface OrganizationUnitGetChildrenDto {
	/** Id tổ chức cấp trên */
	id: string;
	/** Truy vấn đệ quy cấp con */
	recursive?: boolean;
}

interface GetIdentityUsersInput extends PagedAndSortedResultRequestDto {
	filter?: string;
}

interface GetIdentityRolesInput extends PagedAndSortedResultRequestDto {
	filter?: string;
}

interface GetUnaddedUserListInput extends GetUserPagedListInput {
	id: string;
}

interface GetUnaddedRoleListInput extends GetUserPagedListInput {
	id: string;
}

interface OrganizationUnitAddUserDto {
	userIds: string[];
}

interface OrganizationUnitAddRoleDto {
	roleIds: string[];
}

export type {
	GetIdentityRolesInput,
	GetIdentityUsersInput,
	GetOrganizationUnitPagedListInput,
	GetUnaddedRoleListInput,
	GetUnaddedUserListInput,
	OrganizationUnitAddRoleDto,
	OrganizationUnitAddRoleInput,
	OrganizationUnitAddUserDto,
	OrganizationUnitAddUserInput,
	OrganizationUnitCreateDto,
	OrganizationUnitDto,
	OrganizationUnitGetChildrenDto,
	OrganizationUnitUpdateDto,
};
