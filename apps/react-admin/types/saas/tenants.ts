import type {
	ExtensibleAuditedEntityDto,
	ExtensibleObject,
	IHasConcurrencyStamp,
	NameValue,
	PagedAndSortedResultRequestDto,
} from "#/abp-core";

type TenantConnectionStringDto = NameValue<string>;

type TenantConnectionStringSetInput = NameValue<string>;

interface TenantDto extends ExtensibleAuditedEntityDto<string>, IHasConcurrencyStamp {
	/** Thời gian vô hiệu hóa */
	disableTime?: string;
	/** Id phiên bản */
	editionId?: string;
	/** Tên phiên bản */
	editionName?: string;
	/** Thời gian kích hoạt */
	enableTime?: string;
	/** Có khả dụng không */
	isActive: boolean;
	/** Tên */
	name: string;
	/** Tên */
	normalizedName: string;
}

interface GetTenantPagedListInput extends PagedAndSortedResultRequestDto {
	filter?: string;
}

interface TenantCreateOrUpdateBase extends ExtensibleObject {
	/** Thời gian vô hiệu hóa */
	disableTime?: string;
	/** Id phiên bản */
	editionId?: string;
	/** Thời gian kích hoạt */
	enableTime?: string;
	/** Có khả dụng không */
	isActive: boolean;
	/** Tên */
	name: string;
}

interface TenantCreateDto extends TenantCreateOrUpdateBase {
	adminEmailAddress: string;
	adminPassword: string;
	connectionStrings?: TenantConnectionStringSetInput[];
	defaultConnectionString?: string;
	useSharedDatabase: boolean;
}

interface TenantConnectionStringCheckInput {
	connectionString: string;
	name?: string;
	provider: string;
}

interface TenantUpdateDto extends IHasConcurrencyStamp, TenantCreateOrUpdateBase {}

export type {
	GetTenantPagedListInput,
	TenantConnectionStringCheckInput,
	TenantConnectionStringDto,
	TenantConnectionStringSetInput,
	TenantCreateDto,
	TenantDto,
	TenantUpdateDto,
};
