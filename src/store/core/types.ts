import { PayloadAction } from '@reduxjs/toolkit';

import { combinedReducer } from '~/store/core/reducer';
import { store } from '~/store/core/store';

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof combinedReducer>;
export type SlicePayloadAction<P, T> = PayloadAction<P, string, { arg: { originalArgs: T } }>;
