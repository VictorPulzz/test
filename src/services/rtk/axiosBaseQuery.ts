import { BaseQueryFn } from '@reduxjs/toolkit/query';
import { AxiosError, AxiosRequestConfig } from 'axios';

import { Api } from './api';

export function axiosBaseQuery(): BaseQueryFn<
	{
		data?: AxiosRequestConfig['data'];
		extraOptions?: {
			[key in string]: never;
		};
		headers?: AxiosRequestConfig['headers'];
		method?: AxiosRequestConfig['method'];
		params?: AxiosRequestConfig['params'];
		transformRequest?: AxiosRequestConfig['transformRequest'];
		url: string;
	},
	unknown,
	unknown
> {
	return async ({
		url,
		method = 'GET',
		data,
		params,
		headers,
		transformRequest,
		extraOptions = null,
	}) => {
		try {
			const result = await Api.request({
				url,
				method,
				data,
				params,
				headers,
				transformRequest,
			});

			// eslint-disable-next-line @typescript-eslint/ban-types
			return { data: Object.assign(result.data as {}, extraOptions ? { extraOptions } : {}) };
		} catch (axiosError) {
			const err = axiosError as AxiosError;
			return {
				error: { status: err.response?.status, data: err.response?.data, extraOptions },
			};
		}
	};
}
