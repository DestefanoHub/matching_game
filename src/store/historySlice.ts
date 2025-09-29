import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

import { getGames } from '../utils/gateway';
import type { WinLoss, Difficulty, SortBy, Game } from '../utils/types';
import type { RootState, AppThunk } from './store';

type State = {
    search: string,
    wlFilter: WinLoss,
    diffFilter: Difficulty,
    sort: SortBy,
    page: number,
    totalGames: number,
    games: Game[],
    isLoaded: boolean
};

const initialState: State = {
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
        search: (state, action: PayloadAction<string>) => {
            state.search = action.payload;
            state.isLoaded = false;
        },
        wlFilter: (state, action: PayloadAction<WinLoss>) => {
            state.wlFilter = action.payload;
            state.isLoaded = false;
        },
        diffFilter: (state, action: PayloadAction<Difficulty>) => {
            state.diffFilter = +action.payload as Difficulty;
            state.isLoaded = false;
        },
        sort: (state, action: PayloadAction<SortBy>) => {
            state.sort = action.payload;
            state.isLoaded = false;
        },
        setGames: (state, action: PayloadAction<{games: Game[], totalGames: number, page: number}>) => {
            state.games = action.payload.games;
            state.totalGames = action.payload.totalGames;
            state.page = action.payload.page;
            state.isLoaded = true;
        }
    }
});

export const searchThunk = (searchTerm: string): AppThunk<void> => async (dispatch) => {
    dispatch(search(searchTerm));
    dispatch(getGamesThunk(-1));
};

export const wlFilterThunk = (wlFilterValue: WinLoss): AppThunk<void> => async (dispatch) => {
    dispatch(wlFilter(wlFilterValue));
    dispatch(getGamesThunk(-1));
};

export const diffFilterThunk = (diffFIlterValue: Difficulty): AppThunk<void> => async (dispatch) => {
    dispatch(diffFilter(diffFIlterValue));
    dispatch(getGamesThunk(-1));
};

export const sortThunk = (sortValue: SortBy): AppThunk<void> => async (dispatch) => {
    dispatch(sort(sortValue));
    dispatch(getGamesThunk(-1));
};

export const getGamesThunk = (pageNum = 0): AppThunk<void> => async (dispatch, getState) => {
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
        games: gamesData.games,
        totalGames: gamesData.totalGames,
        page: pageToSend
    }));
};

export const { search, wlFilter, diffFilter, sort, setGames } = historySlice.actions;
export const selectSearch = (state: RootState) => state.history.search;
export const selectWLFilter = (state: RootState) => state.history.wlFilter;
export const selectDiffFilter = (state: RootState) => state.history.diffFilter;
export const selectSort = (state: RootState) => state.history.sort;
export const selectPage = (state: RootState) => state.history.page;
export const selectTotalGames = (state: RootState) => state.history.totalGames;
export const selectGames = (state: RootState) => state.history.games;
export const selectIsLoaded = (state: RootState) => state.history.isLoaded;
export default historySlice.reducer;