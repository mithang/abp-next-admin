import axios, { type AxiosRequestConfig, type AxiosError, type AxiosResponse } from "axios";

import { t } from "@/locales/i18n";
import userStore, { useUserToken } from "@/store/userStore";

import { toast } from "sonner";
//TODO rm
// Tạo axios instance
const axiosInstance = axios.create({
	baseURL: import.meta.env.VITE_APP_BASE_API,
	timeout: 50000,
	headers: { "Content-Type": "application/json;charset=utf-8" },
});

// Interceptor cho request
axiosInstance.interceptors.request.use(
	(config) => {
		// Làm gì đó trước khi request được gửi đi
		const { accessToken } = useUserToken();
		config.headers.Authorization = `${accessToken}`;
		return config;
	},
	(error) => {
		// Làm gì đó khi request lỗi
		return Promise.reject(error);
	},
);

// Interceptor cho response
axiosInstance.interceptors.response.use(
	(res: AxiosResponse<any>) => {
		const { data, status, headers } = res;

		if (headers._abpwrapresult === "true") {
			const { code, result, message, details } = data;
			const hasSuccess = data && Reflect.has(data, "code") && code === "0";
			if (hasSuccess) {
				return result;
			}
			const content = details || message;

			throw new Error(content);
		}

		if (status >= 200 && status < 400) {
			return data;
		}

		// Lỗi request nghiệp vụ
		throw new Error(t("sys.api.apiRequestFailed"));
	},
	(error: AxiosError<any>) => {
		const { response, message } = error || {};

		const errMsg = response?.data?.message || message || t("sys.api.errorMessage");
		toast.error(errMsg, {
			position: "top-center",
		});

		const status = response?.status;
		if (status === 401) {
			userStore.getState().actions.clearUserInfoAndToken();
		}
		return Promise.reject(error);
	},
);

class APIClient {
	get<T = any>(config: AxiosRequestConfig): Promise<T> {
		return this.request({ ...config, method: "GET" });
	}

	post<T = any>(config: AxiosRequestConfig): Promise<T> {
		return this.request({ ...config, method: "POST" });
	}

	put<T = any>(config: AxiosRequestConfig): Promise<T> {
		return this.request({ ...config, method: "PUT" });
	}

	delete<T = any>(config: AxiosRequestConfig): Promise<T> {
		return this.request({ ...config, method: "DELETE" });
	}

	request<T = any>(config: AxiosRequestConfig): Promise<T> {
		return new Promise((resolve, reject) => {
			axiosInstance
				.request<any, AxiosResponse<any>>(config)
				.then((res: AxiosResponse<any>) => {
					resolve(res as unknown as Promise<T>);
				})
				.catch((e: Error | AxiosError) => {
					reject(e);
				});
		});
	}
}
export default new APIClient();
