import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    username: '',
    authToken: null,
};

export const sessionSlice = createSlice({
    name: 'history',
    initialState,
    reducers: {
        login: (state, action) => {
            state.username = action.payload.username;
            state.authToken = action.payload.token;
        },
        logout: () => {
            return initialState;
        }
    }
});

export const { login, logout } = sessionSlice.actions;
export const selectUsername = (state) => state.session.username;
export const selectAuthToken = (state) => state.session.authToken;
export const selectLoginState = (state) => state.session.authToken !== null;
export default sessionSlice.reducer;