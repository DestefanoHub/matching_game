import { configureStore, type ThunkAction, type UnknownAction } from '@reduxjs/toolkit';

import gameReducer from './gameSlice';
import historyReducer from './historySlice';
import sessionReducer from './sessionSlice';

const store = configureStore({
    reducer: {
        game: gameReducer,
        history: historyReducer,
        session: sessionReducer
    }
});

export default store;

export type AppStore = typeof store;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  UnknownAction
>;