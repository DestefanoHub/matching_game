import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

import type { RootState, AppThunk } from './store';
import type { Player } from '../utils/types';

const initialState: Player = {
    id: '',
    username: '',
    JWT: ''
};

export const sessionSlice = createSlice({
    name: 'session',
    initialState,
    reducers: {
        login: (state, action: PayloadAction<Player>) => {
            state.id = action.payload.id;
            state.username = action.payload.username;
            state.JWT = action.payload.JWT;
        },
        logout: () => {
            return initialState;
        }
    }
});

export const { login, logout } = sessionSlice.actions;
export const selectID = (state: RootState) => state.session.id;
export const selectUsername = (state: RootState) => state.session.username;
export const selectAuthToken = (state: RootState) => state.session.JWT;
export const selectLoginState = (state: RootState) => state.session.JWT.length;
export default sessionSlice.reducer;