import { createSelector, Selector } from '@reduxjs/toolkit';

import { RootState } from '~/store/core/types';
import { UserState } from '~/store/modules/user/types';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const selectSelf: Selector<RootState, UserState> = state => state.user;

export const selectIsAuth: ReturnSelector<RootState, boolean> = createSelector(
	selectSelf,
	state => !!state.auth,
);

export const selectTokens: ReturnSelector<RootState, UserState['auth']> = createSelector(
	selectSelf,
	state => state.auth,
);
