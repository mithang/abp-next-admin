import type { AxiosInstance, AxiosRequestConfig, AxiosResponse, CreateAxiosDefaults } from "axios";

import axios from "axios";

import { FileDownloader } from "./modules/downloader";
import { InterceptorManager } from "./modules/interceptor";
import { FileUploader } from "./modules/uploader";
import type { RequestClientOptions } from "./types";
import { merge } from "@/utils/merge";
import { bindMethods } from "@/utils";

class RequestClient {
	private readonly instance: AxiosInstance;

	public addRequestInterceptor: InterceptorManager["addRequestInterceptor"];
	public addResponseInterceptor: InterceptorManager["addResponseInterceptor"];

	public download: FileDownloader["download"];
	// Có đang làm mới token không
	public isRefreshing = false;
	// Hàng đợi làm mới token
	public refreshTokenQueue: ((token: string) => void)[] = [];
	public upload: FileUploader["upload"];

	/**
	 * Hàm khởi tạo, dùng để tạo instance Axios
	 * @param options - Cấu hình request Axios, tùy chọn
	 */
	constructor(options: RequestClientOptions = {}) {
		// Gộp cấu hình mặc định và cấu hình truyền vào
		const defaultConfig: CreateAxiosDefaults = {
			headers: {
				"Content-Type": "application/json;charset=utf-8",
			},
			// Thời gian timeout mặc định
			timeout: 10_000,
		};
		const { ...axiosConfig } = options;
		const requestConfig = merge(axiosConfig, defaultConfig);
		this.instance = axios.create(requestConfig);

		bindMethods(this);

		// Khởi tạo trình quản lý interceptor
		const interceptorManager = new InterceptorManager(this.instance);
		this.addRequestInterceptor = interceptorManager.addRequestInterceptor.bind(interceptorManager);
		this.addResponseInterceptor = interceptorManager.addResponseInterceptor.bind(interceptorManager);

		// Khởi tạo trình tải lên file
		const fileUploader = new FileUploader(this);
		this.upload = fileUploader.upload.bind(fileUploader);
		// Khởi tạo trình tải xuống file
		const fileDownloader = new FileDownloader(this);
		this.download = fileDownloader.download.bind(fileDownloader);
	}

	/**
	 * Phương thức request DELETE
	 */
	public delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
		return this.request<T>(url, { ...config, method: "DELETE" });
	}

	/**
	 * Phương thức request GET
	 */
	public get<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
		return this.request<T>(url, { ...config, method: "GET" });
	}

	/**
	 * Phương thức request POST
	 */
	public post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
		return this.request<T>(url, { ...config, data, method: "POST" });
	}

	/**
	 * Phương thức request PUT
	 */
	public put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
		return this.request<T>(url, { ...config, data, method: "PUT" });
	}

	/**
	 * Phương thức request chung
	 */
	public async request<T>(url: string, config: AxiosRequestConfig): Promise<T> {
		try {
			const response: AxiosResponse<T> = await this.instance({
				url,
				...config,
			});
			return response as T;
		} catch (error: any) {
			throw error.response ? error.response.data : error;
		}
	}
}

export { RequestClient };
