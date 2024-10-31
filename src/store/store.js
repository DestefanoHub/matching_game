import { configureStore } from '@reduxjs/toolkit';
import gameReducer from './gameSlice';
import appReducer from './appSlice';

const store = configureStore({
    reducer: {
        game: gameReducer,
        app: appReducer
    }
});

export default store;