import axios, { AxiosError, type AxiosInstance } from "axios";
import HttpStatusCode from "@/constants/httpStatusCode.enum";

import {
	getAccessTokenFromLocalStorage,
	clearLocalStorage,
	saveAccessTokenToLocalStorage,
	saveRefreshTokenToLocalStorage,
	getRefreshTokenFromLocalStorage,
} from "./auth";

class Http {
	instance: AxiosInstance;
	private accessToken: string; // luu tren RAM
	private refreshToken: string; // luu tren RAM
	private refreshTokenRequest: Promise<string> | null;
	constructor() {
		this.accessToken = getAccessTokenFromLocalStorage();
		this.refreshToken = getRefreshTokenFromLocalStorage();
		this.refreshTokenRequest = null;

		this.instance = axios.create({
			baseURL: "http://localhost:4000/api",
			timeout: 10000,
			headers: {
				"Content-Type": "application/json",
			},
		});
		//voi route can xac thuc, gui token len bang header voi key la authorization
		this.instance.interceptors.request.use(
			(config) => {
				if (this.accessToken && config?.headers) {
					config.headers.Authorization = `Bearer ${this.accessToken}`;
					return config;
				}
				return config;
			},
			(error) => {
				return Promise.reject(error);
			}
		);
		this.instance.interceptors.response.use(
			(response) => {
				const { url } = response.config; //goi lai api login neu loi token, path cua api
				if (url === "/login" || url === "/register") {
					this.accessToken = (
						response.data as any
					)?.data?.access_token;
					this.refreshToken = (
						response.data as any
					)?.data?.refresh_token;
					saveAccessTokenToLocalStorage(this.accessToken);
					saveRefreshTokenToLocalStorage(this.refreshToken);
				} else if (url === "/logout") {
					this.accessToken = "";
					this.refreshToken = "";
					clearLocalStorage();
				}
				// toast.success(response?.data.message)
				return response;
			},
			(error: AxiosError) => {
				const config = error.response?.config || {
					headers: {},
					url: "",
				};
				const url = config.url;
				if (
					error.response?.status !==
						HttpStatusCode.UnprocessableEntity &&
					error.response?.status !== HttpStatusCode.Unauthorized
				) {
					// eslint-disable-next-line @typescript-eslint/no-explicit-any
					const data: any = error.response?.data;
					const message = data?.message ?? error.message;
					// toast.error(message);
				}

				//loi 401
			}
		);
	}
}

const http = new Http().instance;

export default http;
