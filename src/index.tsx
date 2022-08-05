import './view/styles/global.scss';

import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { PersistGate } from 'redux-persist/integration/react';

import { persistor, store } from '~/store/core/store';
import { App } from '~/view/components/app';

const CONTAINER_SELECTOR = 'root';

const container = document.getElementById(CONTAINER_SELECTOR);

if (!container) {
	throw new Error(`Element with id "${CONTAINER_SELECTOR}" not found`);
}

const root = createRoot(container);

root.render(
	<Provider store={store}>
		<PersistGate {...{ persistor, loading: null }}>
			<BrowserRouter>
				<App />
			</BrowserRouter>
		</PersistGate>
	</Provider>,
);
