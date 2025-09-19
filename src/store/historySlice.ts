import { createSlice } from '@reduxjs/toolkit';

import { getGames } from '../utils/gateway';
import { type WinLoss, type Difficulty, type SortBy } from '../utils/types';

const initialState = {
    search: '',
    wlFilter: 'a',
    diffFilter: 0,
    sort: 'dd',
    page: 1,
    totalGames: 0,
    games: [],
    isLoaded: false
};

export const historySlice = createSlice({
    name: 'history',
    initialState,
    reducers: {
        search: (state, action) => {
            state.search = action.payload;
            state.isLoaded = false;
        },
        wlFilter: (state, action) => {
            state.wlFilter = action.payload;
            state.isLoaded = false;
        },
        diffFilter: (state, action) => {
            state.diffFilter = +action.payload;
            state.isLoaded = false;
        },
        sort: (state, action) => {
            state.sort = action.payload;
            state.isLoaded = false;
        },
        setGames: (state, action) => {
            state.games = action.payload.games;
            state.totalGames = action.payload.totalGames;
            state.page = action.payload.page;
            state.isLoaded = true;
        }
    }
});

export const searchThunk = (searchTerm: string) => async (dispatch) => {
    dispatch(search(searchTerm));
    dispatch(getGamesThunk(-1));
};

export const wlFilterThunk = (wlFilterValue: WinLoss) => async (dispatch) => {
    dispatch(wlFilter(wlFilterValue));
    dispatch(getGamesThunk(-1));
};

export const diffFilterThunk = (diffFIlterValue: Difficulty) => async (dispatch) => {
    dispatch(diffFilter(diffFIlterValue));
    dispatch(getGamesThunk(-1));
};

export const sortThunk = (sortValue: SortBy) => async (dispatch) => {
    dispatch(sort(sortValue));
    dispatch(getGamesThunk(-1));
};

export const getGamesThunk = (pageNum = 0) => async (dispatch, getState) => {
    const historyState = getState().history;
    let pageToSend = 1;

    if(pageNum === -1){
        //Page should be reset
        pageToSend = 1;
    }else if(pageNum === 0){
        //Page should remain at it's current value
        pageToSend = historyState.page;
    }else{
        //Page should be changed
        if(pageNum <= Math.ceil(historyState.totalGames / 10)){
            pageToSend = pageNum;
        }
    }

    const gamesData = await getGames(historyState.search, historyState.wlFilter, historyState.diffFilter, historyState.sort, pageToSend);

    dispatch(setGames({
        games: gamesData.gamesArray,
        totalGames: gamesData.totalGames,
        page: pageToSend
    }));
};

export const { search, wlFilter, diffFilter, sort, setGames } = historySlice.actions;
export const selectSearch = (state) => state.history.search;
export const selectWLFilter = (state) => state.history.wlFilter;
export const selectDiffFilter = (state) => state.history.diffFilter;
export const selectSort = (state) => state.history.sort;
export const selectPage = (state) => state.history.page;
export const selectTotalGames = (state) => state.history.totalGames;
export const selectGames = (state) => state.history.games;
export const selectIsLoaded = (state) => state.history.isLoaded;
export default historySlice.reducer;