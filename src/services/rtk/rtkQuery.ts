import { createApi } from '@reduxjs/toolkit/query/react';

import { axiosBaseQuery } from '~/services/rtk/axiosBaseQuery';
import { cacher } from '~/services/rtk/utils';

export const rtkQuery = createApi({
	reducerPath: 'rtkReducer',
	baseQuery: axiosBaseQuery(),
	tagTypes: Object.values(cacher.tags),
	endpoints: () => ({}),
});
