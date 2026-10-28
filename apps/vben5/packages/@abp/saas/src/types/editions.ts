import type {
  ExtensibleAuditedEntityDto,
  IHasConcurrencyStamp,
  PagedAndSortedResultRequestDto,
} from '@abp/core';

interface EditionDto
  extends ExtensibleAuditedEntityDto<string>, IHasConcurrencyStamp {
  /** Tên hiển thị */
  displayName: string;
}

interface EditionCreateOrUpdateBase {
  /** Tên hiển thị */
  displayName: string;
}

type EditionCreateDto = EditionCreateOrUpdateBase;

interface EditionUpdateDto
  extends EditionCreateOrUpdateBase, IHasConcurrencyStamp {}

interface GetEditionPagedListInput extends PagedAndSortedResultRequestDto {
  filter?: string;
}

export type {
  EditionCreateDto,
  EditionDto,
  EditionUpdateDto,
  GetEditionPagedListInput,
};
