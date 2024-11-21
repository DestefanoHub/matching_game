import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    games: []
};

export const appSlice = createSlice({
    name: 'app',
    initialState,
    reducers: {
        addGame: (state, action) => {
            state.games.push(action.payload);
            
            return state;
        }
    }
});

export const { addGame } = appSlice.actions;
export const selectGames = (state) => state.app.games;
export default appSlice.reducer;