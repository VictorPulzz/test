import axios, {
	AxiosError,
	AxiosInstance,
	AxiosPromise,
	AxiosRequestConfig,
	AxiosResponse,
} from 'axios';

import { API_URL, REFRESH_TOKEN_URL } from '~/constants/env';
import { store } from '~/store/core/store';
import { setAuth, signOut } from '~/store/modules/user/slice';

let isRefreshing = false;
type FailedQueueType = { reject: (value: unknown) => void; resolve: (value: unknown) => void };
let failedQueue: FailedQueueType[] = [];

const processQueue = (error: AxiosError | null, token: string): void => {
	failedQueue.forEach(prom => {
		if (error) {
			prom.reject(error);
		} else {
			prom.resolve(token);
		}
	});

	failedQueue = [];
};

const axiosErrorHandler = (
	res:
		| AxiosResponse<{
				detail: { [key: string]: string | [] };
				message: string;
		  }>
		| undefined,
): void => {
	// eslint-disable-next-line no-console
	console.log(res);
};

interface AxiosRequestConfigInner extends AxiosRequestConfig {
	retry: boolean;
}

const setTokenInterceptors = (instance: AxiosInstance): void => {
	instance.interceptors.request.use(
		(config: AxiosRequestConfig) => {
			const token = store.getState().user.auth?.access;
			if (token && config.headers) {
				config.headers.Authorization = `Bearer ${token}`;
			}
			return config;
		},
		error => {
			return Promise.reject(error);
		},
	);
	instance.interceptors.response.use(
		response => {
			return response;
		},
		(error: AxiosError) => {
			const originalRequest = error.config as AxiosRequestConfigInner;

			if (error?.response?.status !== 401) {
				// eslint-disable-next-line @typescript-eslint/ban-ts-comment
				// @ts-ignore
				axiosErrorHandler(error.response);
			}
			if (
				error?.response?.status === 401 &&
				!originalRequest?.retry &&
				originalRequest.url !== REFRESH_TOKEN_URL
			) {
				if (isRefreshing) {
					return new Promise((resolve, reject) => {
						failedQueue.push({ resolve, reject });
					})
						.then(token => {
							if (originalRequest.headers) {
								originalRequest.headers.Authorization = `Bearer ${token}`;
							}
							return instance(originalRequest);
						})
						.catch(err => {
							return Promise.reject(err);
						});
				}

				originalRequest.retry = true;
				isRefreshing = true;

				return new Promise((resolve, reject) => {
					instance
						.post(REFRESH_TOKEN_URL, { refresh: store.getState().user.auth?.refresh })
						.then(({ data }: AxiosResponse<{ access: string; refresh: string }>) => {
							store.dispatch(setAuth({ access: data.access, refresh: data.refresh }));
							instance.defaults.headers.common.Authorization = `Bearer ${data.access}`;
							if (originalRequest.headers) {
								originalRequest.headers.Authorization = `Bearer ${data.access}`;
							}

							processQueue(null, data.access);
							resolve(instance(originalRequest));
						})
						.catch(err => {
							processQueue(err, '');
							store.dispatch(signOut());
							reject(err);
						})
						.then(() => {
							isRefreshing = false;
						});
				});
			}

			return Promise.reject(error);
		},
	);
};

export class Api {
	static instance: Api;

	axiosInstance: AxiosInstance;

	constructor() {
		this.axiosInstance = axios.create({
			timeout: 30000,
			baseURL: API_URL,
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
			},
		});
		setTokenInterceptors(this.axiosInstance);
	}

	static getInstance(): Api {
		if (!Api.instance) {
			Api.instance = new Api();
		}
		return Api.instance;
	}

	static getAxios(): AxiosInstance {
		return Api.getInstance().axiosInstance;
	}

	static request<T = unknown>(requestConfig: AxiosRequestConfig): AxiosPromise<T> {
		return Api.getAxios().request(requestConfig);
	}
}
