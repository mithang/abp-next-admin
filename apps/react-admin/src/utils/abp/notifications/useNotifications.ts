import type { Notification, NotificationInfo } from "#/notifications";

import { NotificationContentType, NotificationSeverity, NotificationType } from "#/notifications";
import { useNotificationSerializer } from "./useNotificationSerializer";
import { useSignalR } from "./useSignalR";
import { useEventBus } from "../useEventBus";
import { Events } from "@/constants/abp-core";
import { notification } from "antd";

export function useNotifications() {
	const { deserialize } = useNotificationSerializer();
	const { publish, subscribe, unSubscribe } = useEventBus();
	const { init, off, on, onStart, stop } = useSignalR();

	/** Đăng ký thông báo */
	function register() {
		_registerEvents();
		_init();
	}

	/** Giải phóng thông báo */
	function release() {
		_releaseEvents();
		stop();
	}

	function _init() {
		onStart(() => on(Events.GetNotification, _onNotifyReceived));
		init({
			autoStart: true,
			serverUrl: "/signalr-hubs/notifications",
			useAccessToken: true,
		});
	}

	/** Đăng ký sự kiện thông báo */
	function _registerEvents() {
		subscribe(Events.UserLogout, stop);
	}

	/** Giải phóng sự kiện thông báo */
	function _releaseEvents() {
		unSubscribe(Events.UserLogout, stop);
		off(Events.GetNotification, _onNotifyReceived);
	}

	/** Callback nhận thông báo */
	function _onNotifyReceived(notificationInfo: NotificationInfo) {
		const notification = deserialize(notificationInfo);
		if (notification.type === NotificationType.ServiceCallback) {
			publish(notification.name, notification);
			return;
		}
		publish(Events.NotificationRecevied, notification);
		_notification(notification);
	}

	/** Đẩy thông báo */
	function _notification(notifier: Notification) {
		let message = notifier.description;
		switch (notifier.contentType) {
			case NotificationContentType.Html:
			case NotificationContentType.Json:
			case NotificationContentType.Markdown: {
				message = notifier.title;
				break;
			}
			case NotificationContentType.Text: {
				message = notifier.description;
			}
		}
		switch (notifier.severity) {
			case NotificationSeverity.Error:
			case NotificationSeverity.Fatal: {
				notification.error({
					description: message,
					message: notifier.title,
				});
				break;
			}
			case NotificationSeverity.Info: {
				notification.info({
					description: message,
					message: notifier.title,
				});
				break;
			}
			case NotificationSeverity.Success: {
				notification.success({
					description: message,
					message: notifier.title,
				});
				break;
			}
			case NotificationSeverity.Warn: {
				notification.warning({
					description: message,
					message: notifier.title,
				});
				break;
			}
		}
	}

	return {
		register,
		release,
	};
}
