import { authenticateResponseInterceptor, errorMessageResponseInterceptor, RequestClient } from "@/request-client";
import useLocaleStore from "@/store/localeI18nStore";
import useUserStore from "@/store/userStore";
import userStore from "@/store/userStore";
import { mapLocaleToAbpLanguageFormat } from "@/utils";
import { toast } from "sonner";
import { refreshToken } from "./account/token";
import { wrapperResult } from "@/utils/abp/request";
import { handleOAuthError } from "@/utils/abp/handleOAuthError";
import useAbpStore from "@/store/abpCoreStore";

const requestClient = new RequestClient({
	baseURL: import.meta.env.VITE_APP_BASE_API,
});

/**
 * Logic xác thực lại
 */
async function doReAuthenticate() {
	console.warn("Access token or refresh token is invalid or expired. ");
	//Đăng xuất trực tiếp
	userStore.getState().actions.clearUserInfoAndToken();
}

/**
 * Logic làm mới token
 */
async function doRefreshToken() {
	console.debug("try -> Refresh token");

	const { userToken } = useUserStore.getState();
	if (!userToken.refreshToken) {
		console.warn("No refresh token available.");
		return "";
	}

	try {
		const res = await refreshToken({ refreshToken: userToken.refreshToken });

		const { tokenType, accessToken, refreshToken: newRefreshToken } = res;

		if (accessToken) {
			// Cập nhật userStore, lưu token mới
			useUserStore.getState().actions.setUserToken({
				accessToken: `${tokenType} ${accessToken}`,
				refreshToken: newRefreshToken,
			});
			console.debug("Token refreshed successfully.");
			return `${tokenType} ${accessToken}`; // Trả về token mới để interceptor sử dụng
		}

		console.error("Failed to refresh token: No access token returned.");
		return "";
	} catch (error) {
		console.error("Error refreshing token:", error);
		return ""; // Trả về chuỗi rỗng, kích hoạt logic đăng nhập lại
	}
}

function formatToken(token: null | string) {
	return token ? token : null; //Có giá trị lấy từ tokenType
}

// Xử lý header của request
requestClient.addRequestInterceptor({
	fulfilled: async (config) => {
		const { userToken } = useUserStore.getState();
		const { tenantId, xsrfToken } = useAbpStore.getState();
		if (userToken.accessToken) {
			config.headers.Authorization = `${userToken.accessToken}`;
		}
		const { locale } = useLocaleStore.getState();
		config.headers["Accept-Language"] = mapLocaleToAbpLanguageFormat(locale);
		// config.headers["X-Request-From"] = "slash-admin";
		config.headers["X-Request-From"] = "vben";

		config.headers.__tenant = tenantId;
		config.headers.RequestVerificationToken = xsrfToken;

		return config;
	},
});

// Destructuring dữ liệu response
requestClient.addResponseInterceptor<any>({
	fulfilled: (response) => {
		const { data, status } = response;
		const { hasWrapResult, getData } = wrapperResult(response);

		if (hasWrapResult()) {
			return getData();
		}

		if (status >= 200 && status < 400) {
			return data;
		}

		throw Object.assign({}, response, { response });
	},
});

// Xử lý khi token hết hạn
requestClient.addResponseInterceptor(
	authenticateResponseInterceptor({
		client: requestClient,
		doReAuthenticate,
		doRefreshToken,
		enableRefreshToken: true,
		formatToken,
	}),
);

// Xử lý lỗi chung, nếu không vào logic xử lý lỗi ở trên thì sẽ vào đây
requestClient.addResponseInterceptor(
	errorMessageResponseInterceptor((msg: string, error) => {
		// Tại đây có thể tùy chỉnh theo nghiệp vụ, bạn có thể lấy thông tin trong error để xử lý tùy chỉnh, hiển thị thông báo khác nhau theo từng code thay vì trực tiếp dùng message.error để hiển thị msg
		// Trường lỗi mà interface mock hiện tại trả về là error hoặc message
		const responseData = error?.response?.data ?? {};
		if (responseData?.error_description) {
			const { formatError } = handleOAuthError();
			toast.error(formatError(responseData) || msg, {
				position: "top-center",
			});
			return;
		}
		const errorMessage = responseData?.error ?? responseData?.message ?? "";
		// Nếu không có thông tin lỗi thì sẽ hiển thị thông báo theo mã trạng thái
		toast.error(errorMessage || msg, {
			position: "top-center",
		});
	}),
);

export default requestClient;
