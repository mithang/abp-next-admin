interface OAuthError {
	error: string;
	error_description?: string;
	error_uri?: string;
}

export function handleOAuthError() {
	function formatError(error: OAuthError) {
		// TODO: Giải quyết việc quốc tế hóa thông điệp oauth.
		return error.error_description;
	}

	return {
		formatError,
	};
}
