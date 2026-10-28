import type { AxiosResponse } from "axios";

import { errorFormat } from "./useErrorFormat";

export function wrapperResult(response: AxiosResponse) {
	const { hasError, throwIfError: throwIfAbpError } = errorFormat(response);
	const _defaultWrapperHeaderKey: string = "_abpwrapresult";
	const { data, headers } = response;
	/** Kết quả đã được đóng gói hay chưa */
	function hasWrapResult(): boolean {
		return headers[_defaultWrapperHeaderKey] === "true" || hasError();
	}

	/** Lấy kết quả đã đóng gói */
	function getData(): any {
		throwIfError();
		return data.result;
	}

	/** Nếu yêu cầu lỗi, ném ngoại lệ */
	function throwIfError(): void {
		throwIfAbpError();
		const { code, details, message } = data;
		const hasSuccess = data && Reflect.has(data, "code") && code === "0";
		if (!hasSuccess) {
			const content = details || message;
			throw Object.assign({}, response, { message: content, response });
		}
	}

	return {
		getData,
		hasWrapResult,
	};
}
