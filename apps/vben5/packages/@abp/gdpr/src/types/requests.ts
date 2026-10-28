import type { EntityDto, PagedAndSortedResultRequestDto } from '@abp/core';

interface GdprRequestDto extends EntityDto<string> {
  /** Thời gian tạo */
  creationTime: string;
  /** Thời gian sẵn sàng */
  readyTime: string;
}

interface GdprRequestGetListInput extends PagedAndSortedResultRequestDto {
  /** Thời gian tạo */
  creationTime?: string;
  /** Thời gian sẵn sàng */
  readyTime?: string;
}

export type { GdprRequestDto, GdprRequestGetListInput };
