import { configureStore } from '@reduxjs/toolkit';

import gameReducer from './gameSlice';
import historyReducer from './historySlice';

const store = configureStore({
    reducer: {
        game: gameReducer,
        history: historyReducer,
    }
});

export default store;