import type { PagedAndSortedResultRequestDto } from "#/abp-core";

import type {
	NotificationContentType,
	NotificationData,
	NotificationLifetime,
	NotificationReadState,
	NotificationSeverity,
	NotificationType,
} from "./notifications";

interface GetMyNotifilerPagedListInput extends PagedAndSortedResultRequestDto {
	filter?: string;
	/** Trạng thái đã đọc */
	readState?: NotificationReadState;
}

interface MarkReadStateInput {
	idList: string[];
	state: NotificationReadState;
}

interface UserNotificationDto {
	/** Loại nội dung */
	contentType: NotificationContentType;
	/** Thời gian tạo */
	creationTime: Date;
	/** Dữ liệu */
	data: NotificationData;
	/** Id */
	id: string;
	/** Vòng đời */
	lifetime: NotificationLifetime;
	/** Tên */
	name: string;
	/** Mức độ khẩn cấp */
	severity: NotificationSeverity;
	/** Trạng thái đọc */
	state: NotificationReadState;
	/** Loại */
	type: NotificationType;
}

export type { GetMyNotifilerPagedListInput, MarkReadStateInput, UserNotificationDto };
