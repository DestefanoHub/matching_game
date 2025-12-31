import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

import type { RootState } from './store';
import type { Player } from '../utils/types';

const initialState: Player = {
    ID: '',
    username: '',
    JWT: ''
};

export const sessionSlice = createSlice({
    name: 'session',
    initialState,
    reducers: {
        login: (state, action: PayloadAction<Player>) => {
            state.ID = action.payload.ID;
            state.username = action.payload.username;
            state.JWT = action.payload.JWT;
        },
        logout: () => {
            return initialState;
        }
    }
});

export const { login, logout } = sessionSlice.actions;
export const selectSession = (state: RootState) => state.session;
export const selectID = (state: RootState) => state.session.ID;
export const selectUsername = (state: RootState) => state.session.username;
export const selectAuthToken = (state: RootState) => state.session.JWT;
export const selectLoginState = (state: RootState) => (typeof state.session.JWT !== 'undefined' && state.session.JWT.length) ? true : false;
export default sessionSlice.reducer;