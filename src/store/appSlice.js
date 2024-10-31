import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    games: []
};

export const appSlice = createSlice({
    name: 'app',
    initialState,
    reducers: {

    }
});

export default appSlice.reducer;