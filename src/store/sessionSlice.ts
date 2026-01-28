import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

import type { AppThunk, RootState } from './store';
import type { Player } from '../utils/types';

const initialState: Player = {
    ID: '',
    username: '',
    JWT: ''
};

export function checkSessionStorage(): Player {
    const userJSON = sessionStorage.getItem('user');
    
    if(userJSON === null){
        return initialState;
    }

    return JSON.parse(userJSON);
}

export const sessionSlice = createSlice({
    name: 'session',
    initialState,
    reducers: {
        setSession: (state, action: PayloadAction<Player>) => {
            state.ID = action.payload.ID;
            state.username = action.payload.username;
            state.JWT = action.payload.JWT;
        },
        logout: () => {
            sessionStorage.clear();
            return initialState;
        }
    }
});

export const loginThunk = (player: Player) : AppThunk<void> => async (dispatch) => {
    dispatch(setSession(player));
    sessionStorage.setItem('user', JSON.stringify(player));
};

export const { setSession, logout } = sessionSlice.actions;
export const selectSession = (state: RootState) => state.session;
export const selectID = (state: RootState) => state.session.ID;
export const selectUsername = (state: RootState) => state.session.username;
export const selectAuthToken = (state: RootState) => state.session.JWT;
export const selectLoginState = (state: RootState) => (typeof state.session.JWT !== 'undefined' && state.session.JWT.length) ? true : false;
export default sessionSlice.reducer;