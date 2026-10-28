import type { RemoteServiceErrorInfo } from "#/abp-core";
import type { AxiosResponse } from "axios";

export function errorFormat(response: AxiosResponse) {
	const _defaultErrorHeaderKey: string = "_abperrorformat";
	const { data, headers } = response;
	/** Có phải lỗi yêu cầu hay không */
	function hasError(): boolean {
		return headers[_defaultErrorHeaderKey] === "true";
	}
	/** Nếu yêu cầu lỗi, ném ngoại lệ */
	function throwIfError(): void {
		if (!hasError()) return;
		const errorJson = data.error as RemoteServiceErrorInfo;
		let errorMessage = errorJson.message;
		if (errorJson.validationErrors) {
			errorMessage += errorJson.validationErrors.map((error) => error.message).join("\n");
		}
		throw Object.assign({}, response, { message: errorMessage, response });
	}

	return {
		hasError,
		throwIfError,
	};
}
