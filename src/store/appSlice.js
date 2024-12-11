import { createSlice, createSelector } from '@reduxjs/toolkit';

import { insertGame, getGames } from '../database';

const initialState = {
    games: []
};

export const appSlice = createSlice({
    name: 'app',
    initialState,
    reducers: {
        addGame: (state, action) => {
            state.games.push(action.payload);
        },
    }
});

export const addGameThunk = (game) => async (dispatch, getState) => {
    await insertGame(game);
};

export const getGamesThunk = () => async (dispatch, getState) => {
    const gamesArray = [];
    const games = await getGames();
    games.forEach((game) => {
        gamesArray.push(game);
    });

    return gamesArray;
};

export const { addGame } = appSlice.actions;
export const selectGames = (state) => state.app.games;
export const selectRecentGames = createSelector([selectGames], (games) => games.toReversed().slice(0, 5));
export default appSlice.reducer;