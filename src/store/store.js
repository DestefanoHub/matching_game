import { configureStore } from '@reduxjs/toolkit';

import gameReducer from './gameSlice';
import historyReducer from './historySlice';
import sessionSlice from './sessionSlice';

const store = configureStore({
    reducer: {
        game: gameReducer,
        history: historyReducer,
        session: sessionSlice
    }
});

export default store;