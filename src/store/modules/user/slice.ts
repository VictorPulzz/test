import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { UserState } from '~/store/modules/user/types';
import { authRtk, LoginResponse } from "~/services/rtk/modules";

const initialState: UserState = {
	auth: null,
};

const userSlice = createSlice({
	name: 'user',
	initialState,
	reducers: {
		setAuth: (state, { payload }) => {
			state.auth = payload;
		},
		signOut: state => {
			state.auth = null;
		},
	},
	extraReducers: builder => {
		builder.addMatcher(
			authRtk.endpoints.login.matchFulfilled,
			(state: UserState, action: PayloadAction<LoginResponse>) => {
				userSlice.caseReducers.setAuth(state, action);
			},
		);
	},
});

export const userReducers = userSlice.reducer;
export const { setAuth, signOut } = userSlice.actions;
