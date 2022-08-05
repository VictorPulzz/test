import { AnyAction, combineReducers, Reducer } from '@reduxjs/toolkit';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

import { rtkQuery } from '~/services/rtk/rtkQuery';
import { RootState } from '~/store/core/types';
import { userReducers } from '~/store/modules/user/slice';

const userPersisted = persistReducer(
	{
		key: 'user',
		version: 1,
		storage,
		whitelist: ['auth'],
	},
	userReducers,
);

const combinedReducer = combineReducers({
	user: userPersisted,
	[rtkQuery.reducerPath]: rtkQuery.reducer,
});

const coreReducer: Reducer = (state: RootState, action: AnyAction) => {
	return combinedReducer(state, action);
};

export { combinedReducer, coreReducer };
