import { rtkQuery } from '~/services/rtk/rtkQuery';
import { LoginRequest, LoginResponse } from "~/services/rtk/modules";

export const authRtk = rtkQuery.injectEndpoints({
	endpoints: builder => ({
		login: builder.mutation<LoginResponse, LoginRequest>({
			query: data => ({
				url: '/token/',
				method: 'POST',
				data,
			}),
		}),
	}),
});

export const { useLoginMutation } = authRtk;
