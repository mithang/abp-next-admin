import type { RequestClient } from "./request-client";
import type { MakeErrorMessageFn, ResponseInterceptorConfig } from "./types";

import { t as $t } from "@/locales/i18n";

import axios from "axios";

export const authenticateResponseInterceptor = ({
	client,
	doReAuthenticate,
	doRefreshToken,
	enableRefreshToken,
	formatToken,
}: {
	client: RequestClient;
	doReAuthenticate: () => Promise<void>;
	enableRefreshToken: boolean;
	doRefreshToken: () => Promise<string>;
	formatToken: (token: string) => null | string;
}): ResponseInterceptorConfig => {
	return {
		rejected: async (error) => {
			const { config, response } = error;
			// Nếu không phải lỗi 401, ném ngoại lệ trực tiếp
			if (response?.status !== 401) {
				throw error;
			}
			// Kiểm tra xem tính năng refreshToken có được bật không
			// Nếu chưa bật hoặc đã là yêu cầu thử lại, chuyển thẳng tới đăng nhập lại
			if (!enableRefreshToken || config.__isRetryRequest) {
				await doReAuthenticate();
				throw error;
			}
			// Nếu đang làm mới token, đưa yêu cầu vào hàng đợi và chờ làm mới xong
			if (client.isRefreshing) {
				return new Promise((resolve) => {
					client.refreshTokenQueue.push((newToken: string) => {
						config.headers.Authorization = formatToken(newToken);
						resolve(client.request(config.url, { ...config }));
					});
				});
			}

			// Đánh dấu bắt đầu làm mới token
			client.isRefreshing = true;
			// Đánh dấu yêu cầu hiện tại là yêu cầu thử lại để tránh vòng lặp vô hạn
			config.__isRetryRequest = true;

			try {
				const newToken = await doRefreshToken();

				// Xử lý các yêu cầu trong hàng đợi
				client.refreshTokenQueue.forEach((callback) => callback(newToken));
				// Xóa sạch hàng đợi
				client.refreshTokenQueue = [];

				return client.request(error.config.url, { ...error.config });
			} catch (refreshError) {
				// Nếu làm mới token thất bại, xử lý lỗi (ví dụ buộc đăng xuất hoặc chuyển tới trang đăng nhập)
				client.refreshTokenQueue.forEach((callback) => callback(""));
				client.refreshTokenQueue = [];
				console.error("Refresh token failed, please login again.");
				await doReAuthenticate();

				throw refreshError;
			} finally {
				client.isRefreshing = false;
			}
		},
	};
};

export const errorMessageResponseInterceptor = (makeErrorMessage?: MakeErrorMessageFn): ResponseInterceptorConfig => {
	return {
		rejected: (error: any) => {
			if (axios.isCancel(error)) {
				return Promise.reject(error);
			}

			const err: string = error?.toString?.() ?? "";
			let errMsg = "";
			if (err?.includes("Network Error")) {
				errMsg = $t("ui.fallback.http.networkError");
			} else if (error?.message?.includes?.("timeout")) {
				errMsg = $t("ui.fallback.http.requestTimeout");
			}
			if (errMsg) {
				makeErrorMessage?.(errMsg, error);
				return Promise.reject(error);
			}

			let errorMessage = "";
			const status = error?.response?.status;

			switch (status) {
				case 400: {
					errorMessage = $t("ui.fallback.http.badRequest");
					break;
				}
				case 401: {
					errorMessage = $t("ui.fallback.http.unauthorized");
					break;
				}
				case 403: {
					errorMessage = $t("ui.fallback.http.forbidden");
					break;
				}
				case 404: {
					errorMessage = $t("ui.fallback.http.notFound");
					break;
				}
				case 408: {
					errorMessage = $t("ui.fallback.http.requestTimeout");
					break;
				}
				default: {
					errorMessage = $t("ui.fallback.http.internalServerError");
				}
			}
			makeErrorMessage?.(errorMessage, error);
			return Promise.reject(error);
		},
	};
};
