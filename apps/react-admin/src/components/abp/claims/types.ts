import type { ListResultDto } from "#/abp-core";

import type {
	IdentityClaimCreateDto,
	IdentityClaimDeleteDto,
	IdentityClaimDto,
	IdentityClaimUpdateDto,
} from "#/management/identity/claims";

interface ClaimEditModalProps {
	/** API thêm mới claim */
	createApi: (input: IdentityClaimCreateDto) => Promise<void>;
	/** Mã quyền thêm mới claim */
	createPolicy: string;
	/** API xóa claim */
	deleteApi: (input: IdentityClaimDeleteDto) => Promise<void>;
	/** Mã quyền xóa claim */
	deletePolicy: string;
	/** API cập nhật claim */
	updateApi: (input: IdentityClaimUpdateDto) => Promise<void>;
	/** Mã quyền cập nhật claim */
	updatePolicy: string;
}

interface ClaimModalProps extends ClaimEditModalProps {
	/** API tải danh sách claim */
	getApi: () => Promise<ListResultDto<IdentityClaimDto>>;
	queryKey: string[];
}

interface ClaimModalEvents {
	(event: "change", data: IdentityClaimDto): void;
	(event: "onDelete"): void;
}

export type { ClaimEditModalProps, ClaimModalEvents, ClaimModalProps };
