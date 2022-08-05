import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import { Dispatch } from 'redux';

import { AppDispatch, RootState } from '~/store/core/types';

export const useAppDispatch: () => Dispatch = () => useDispatch<AppDispatch>();

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
