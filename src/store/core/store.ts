import { configureStore } from '@reduxjs/toolkit';
import { FLUSH, PAUSE, PERSIST, persistStore, PURGE, REGISTER, REHYDRATE } from 'redux-persist';

import { rtkQuery } from '~/services/rtk/rtkQuery';
import { coreReducer } from '~/store/core/reducer';

const store = configureStore({
	reducer: coreReducer,
	middleware: getDefaultMiddleware =>
		getDefaultMiddleware({
			immutableCheck: { warnAfter: 128 },
			serializableCheck: {
				warnAfter: 128,
				ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
			},
		}).concat(rtkQuery.middleware),
});

const persistor = persistStore(store);

export { persistor, store };
