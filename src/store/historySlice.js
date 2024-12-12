import { createSlice } from '@reduxjs/toolkit';

import { getGames } from '../database';

const initialState = {
    search: '',
    wlFilter: 'a',
    diffFilter: 0,
    sort: 'dd',
    games: []
};

export const historySlice = createSlice({
    name: 'history',
    initialState,
    reducers: {
        search: (state, action) => {
            state.search = action.payload;
        },
        wlFilter: (state, action) => {
            state.wlFilter = action.payload;
        },
        diffFilter: (state, action) => {
            state.diffFilter = +action.payload;
        },
        sort: (state, action) => {
            state.sort = action.payload;
        },
        setGames: (state, action) => {
            state.games = action.payload;
        }
    }
});

export const getGamesThunk = () => async (dispatch, getState) => {
    const gamesArray = [];
    const historyState = getState().history;
    const history = await getGames(historyState.search, historyState.wlFilter, historyState.diffFilter, historyState.sort);
    history.forEach((game) => {
        gamesArray.push(game);
    });
    dispatch(setGames(gamesArray));
};

export const { search, wlFilter, diffFilter, sort, setGames } = historySlice.actions;
export const selectSearch = (state) => state.history.search;
export const selectWLFilter = (state) => state.history.wlFilter;
export const selectDiffFilter = (state) => state.history.diffFilter;
export const selectSort = (state) => state.history.sort;
export const selectGames = (state) => state.history.games;
export default historySlice.reducer;