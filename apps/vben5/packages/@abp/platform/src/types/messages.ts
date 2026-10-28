import type {
  AuditedEntityDto,
  PagedAndSortedResultRequestDto,
} from '@abp/core';

/** Trạng thái tin nhắn */
export enum MessageStatus {
  /** Gửi thất bại */
  Failed = 10,
  /** Chưa gửi */
  Pending = -1,
  /** Đã gửi */
  Sent = 0,
}
/** Mức độ ưu tiên của email */
export enum MailPriority {
  /** Cao */
  High = 2,
  /** Thấp */
  Low = 1,
  /** Bình thường */
  Normal = 0,
}

interface MessageDto extends AuditedEntityDto<string> {
  /** Nội dung tin nhắn */
  content: string;
  /** Người phát hành tin nhắn */
  provider?: string;
  /** Nguyên nhân lỗi */
  reason?: string;
  /** Bên nhận */
  receiver: string;
  /** Số lần gửi */
  sendCount: number;
  /** Người gửi */
  sender?: string;
  /** Thời gian gửi */
  sendTime?: Date;
  /** Trạng thái */
  status: MessageStatus;
  /** Id người gửi */
  userId?: string;
}
/** Tệp đính kèm email */
interface EmailMessageAttachmentDto {
  /** Tên lưu trữ của tệp đính kèm */
  blobName: string;
  /** Tên tệp đính kèm */
  name: string;
  /** Kích thước tệp đính kèm */
  size: number;
}
/** Tiêu đề email */
interface EmailMessageHeaderDto {
  /** Tên khóa */
  key: string;
  /** Giá trị khóa */
  value: string;
}
/** Tin nhắn email */
interface EmailMessageDto extends MessageDto {
  attachments: EmailMessageAttachmentDto[];
  cc?: string;
  from?: string;
  headers: EmailMessageHeaderDto[];
  isBodyHtml: boolean;
  normalize: boolean;
  priority?: MailPriority;
  subject?: string;
}

interface EmailMessageGetListInput extends PagedAndSortedResultRequestDto {
  beginSendTime?: Date;
  content?: string;
  emailAddress?: string;
  endSendTime?: Date;
  from?: string;
  priority?: MailPriority;
  subject?: string;
}

type SmsMessageDto = MessageDto;

interface SmsMessageGetListInput extends PagedAndSortedResultRequestDto {
  beginSendTime?: Date;
  content?: string;
  endSendTime?: Date;
  phoneNumber?: string;
}

export type {
  EmailMessageDto,
  EmailMessageGetListInput,
  SmsMessageDto,
  SmsMessageGetListInput,
};
