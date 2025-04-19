import { ISuccessResponseApi } from "@/types/utils.type";
import http from "@/utils/http";

export const registerAccount = (body: { email: string; password: string }) =>
	http.post<ISuccessResponseApi<string>>("/register", body);

export const logoutAccount = () => http.post("/logout");
export const loginAccount = (body: { email: string; password: string }) =>
	http.post<ISuccessResponseApi<any>>("/users/login", body);
