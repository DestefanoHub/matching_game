import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    search: '',
    wlFilter: 'a',
    diffFilter: 0,
    sort: 'dd',
    page: 1,
    totalGames: 0,
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
            state.games = action.payload.games;
            state.totalGames = action.payload.totalGames;
            state.page = action.payload.page;
        }
    }
});

export const searchThunk = (searchTerm) => async (dispatch) => {
    dispatch(search(searchTerm));
    dispatch(getGamesThunk(-1));
};

export const wlFilterThunk = (wlFilterValue) => async (dispatch) => {
    dispatch(wlFilter(wlFilterValue));
    dispatch(getGamesThunk(-1));
};

export const diffFilterThunk = (diffFIlterValue) => async (dispatch) => {
    dispatch(diffFilter(diffFIlterValue));
    dispatch(getGamesThunk(-1));
};

export const sortThunk = (sortValue) => async (dispatch) => {
    dispatch(sort(sortValue));
    dispatch(getGamesThunk(-1));
};

export const getGamesThunk = (pageNum = 0) => async (dispatch, getState) => {
    const gamesArray = [];
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

    // const history = await getGames(historyState.search, historyState.wlFilter, historyState.diffFilter, historyState.sort, pageToSend);
    const queryParams = new URLSearchParams();
    queryParams.append('player', historyState.search);
    queryParams.append('winLoss', historyState.wlFilter);
    queryParams.append('diff', historyState.diffFilter);
    queryParams.append('sortBy', historyState.sort);
    queryParams.append('page', pageToSend);
    const response = await fetch(`http://localhost:3100/getGames?${queryParams}`, {
        method: 'GET',
        headers: {
            'Accept': 'application/json'
        }
    });
    const history = await response.json();
    history.games.forEach((game) => {
        gamesArray.push(game);
    });

    dispatch(setGames({
        games: gamesArray,
        totalGames: history.totalGames,
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
export default historySlice.reducer;