import React, { useLayoutEffect } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';

import { MainPage } from '~/view/pages/main';
import { NotFoundPage } from '~/view/pages/not-found';

export const App: React.FC = () => {
	const location = useLocation();

	useLayoutEffect(() => {
		window.scrollTo(0, 0);
	}, [location.pathname]);

	return (
		<main>
			<Routes>
				<Route path="/" element={<MainPage />} />
				<Route path="*" element={<NotFoundPage />} />
			</Routes>
		</main>
	);
};
