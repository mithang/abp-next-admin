import type { ListResultDto } from '@abp/core';

import type {
  IdentityClaimCreateDto,
  IdentityClaimDeleteDto,
  IdentityClaimDto,
  IdentityClaimUpdateDto,
} from '../../types/claims';

interface ClaimEditModalProps {
  /** Api thêm mới claim */
  createApi: (input: IdentityClaimCreateDto) => Promise<void>;
  /** Mã quyền thêm mới claim */
  createPolicy: string;
  /** Api xóa claim */
  deleteApi: (input: IdentityClaimDeleteDto) => Promise<void>;
  /** Mã quyền xóa claim */
  deletePolicy: string;
  /** Api cập nhật claim */
  updateApi: (input: IdentityClaimUpdateDto) => Promise<void>;
  /** Mã quyền cập nhật claim */
  updatePolicy: string;
}

interface ClaimModalProps extends ClaimEditModalProps {
  /** Api tải danh sách claim */
  getApi: () => Promise<ListResultDto<IdentityClaimDto>>;
}

interface ClaimModalEvents {
  (event: 'change', data: IdentityClaimDto): void;
  (event: 'onDelete'): void;
}

export type { ClaimEditModalProps, ClaimModalEvents, ClaimModalProps };
