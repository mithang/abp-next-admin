import type {
	OAuthTokenResult,
	PasswordTokenRequestModel,
	RefreshTokenRequestModel,
	SignInRedirectResult,
	TokenResult,
} from "#/account";
import requestClient from "../request";

/**
 * Người dùng đăng nhập
 * @param request Tham số
 * @returns Token người dùng
 */
export async function loginApi(request: PasswordTokenRequestModel): Promise<TokenResult> {
	const clientId = import.meta.env.VITE_GLOB_CLIENT_ID;
	const clientSecret = import.meta.env.VITE_GLOB_CLIENT_SECRET;
	const scope = import.meta.env.VITE_GLOB_SCOPE;
	const result = await requestClient.post<OAuthTokenResult>(
		"/connect/token",
		{
			client_id: clientId,
			client_secret: clientSecret,
			grant_type: "password",
			password: request.password,
			scope: scope,
			username: request.username,
		},
		{
			headers: {
				"Content-Type": "application/x-www-form-urlencoded",
			},
			timeout: 30_000,
		},
	);
	return {
		accessToken: result.access_token,
		expiresIn: result.expires_in,
		refreshToken: result.refresh_token,
		tokenType: result.token_type,
	};
}

/**
 * Làm mới token
 * @param request
 * @returns
 */
export async function refreshToken(request: RefreshTokenRequestModel): Promise<TokenResult> {
	const clientId = import.meta.env.VITE_GLOB_CLIENT_ID;
	const clientSecret = import.meta.env.VITE_GLOB_CLIENT_SECRET;
	const scope = import.meta.env.VITE_GLOB_SCOPE;
	const result = await requestClient.post<OAuthTokenResult>(
		"/connect/token",
		{
			client_id: clientId,
			client_secret: clientSecret,
			grant_type: "refresh_token",
			refresh_token: request.refreshToken,
			scope: scope,
		},
		{
			headers: {
				"Content-Type": "application/x-www-form-urlencoded",
			},
		},
	);
	return {
		accessToken: result.access_token,
		expiresIn: result.expires_in,
		refreshToken: result.refresh_token,
		tokenType: result.token_type,
	};
}

/**
 * Làm mới token
 * @param request
 * @returns
 */
export async function externalLoginApi(): Promise<TokenResult | SignInRedirectResult> {
	const clientId = import.meta.env.VITE_GLOB_CLIENT_ID;
	const clientSecret = import.meta.env.VITE_GLOB_CLIENT_SECRET;
	const scope = import.meta.env.VITE_GLOB_SCOPE;
	const registerAddress = import.meta.env.VITE_REGISTER_ADDRESS;

	//import: https://stackoverflow.com/questions/61345366/axios-302-responses
	const res = await fetch("/connect/token", {
		method: "POST",
		headers: { "Content-Type": "application/x-www-form-urlencoded" },
		credentials: "include", // Để request mang theo Cookie
		body: new URLSearchParams({
			client_id: clientId,
			client_secret: clientSecret,
			grant_type: "ExternalLogin",
			scope: scope,
			register_address: registerAddress,
		}),
	});

	if (res.redirected) {
		const redirectUrl = new URL(res.url);
		const searchParams = new URLSearchParams(redirectUrl.search);
		const isExternalLogin = searchParams.get("isExternalLogin") === "true";
		const needRegister = searchParams.get("needRegister") === "true";
		return {
			isExternalLogin,
			needRegister,
			// redirectUrl //dự án react này không cần chỗ này
		};
	}
	const result = await res.json();
	return {
		accessToken: result.access_token,
		expiresIn: result.expires_in,
		refreshToken: result.refresh_token,
		tokenType: result.token_type,
	};
}
