export const LocalStorageEventTarget = new EventTarget();

export const saveAccessTokenToLocalStorage = (access_token: string) => {
	localStorage.setItem("access_token", access_token);
};

export const saveRefreshTokenToLocalStorage = (refresh_token: string) => {
	localStorage.setItem("refresh_oken", refresh_token);
};

export const getAccessTokenFromLocalStorage = () =>
	localStorage.getItem("access_token") ?? "";

export const getRefreshTokenFromLocalStorage = () =>
	localStorage.getItem("refresh_token") ?? "";

export const clearLocalStorage = () => {
	const clearLSEvent = new Event("clearLS");
	localStorage.removeItem("access_token");
	localStorage.removeItem("refresh_token");
	localStorage.removeItem("profile");
	LocalStorageEventTarget.dispatchEvent(clearLSEvent);
};

export const getProfileFromLocalStorage = () => {
	const result = localStorage.getItem("profile");
	return result ? JSON.parse(result) : null;
};

export const saveProfileToLocalStorage = (user: any) =>
	localStorage.setItem("profile", JSON.stringify(user));
