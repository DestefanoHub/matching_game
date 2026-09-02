import { combineReducers, configureStore, type ThunkAction, type UnknownAction } from '@reduxjs/toolkit';

import gameReducer from './gameSlice';
import historyReducer from './historySlice';
import sessionReducer from './sessionSlice';

const rootReducer = combineReducers({
    game: gameReducer,
    history: historyReducer,
    session: sessionReducer
});

const store = configureStore({
    reducer: rootReducer
});

export default store;

export { rootReducer };


export type AppStore = typeof store;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  UnknownAction
>;