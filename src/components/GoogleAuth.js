import { Fragment } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { GoogleAuthProvider, getAuth, signInWithPopup, signOut } from 'firebase/auth';

import { login, logout, selectLoginState } from '../store/sessionSlice';

const GoogleAuth = () => {
    const isLoggedIn = useSelector(selectLoginState);
    const dispatch = useDispatch();
    
    const provider = new GoogleAuthProvider();
    const auth = getAuth();

    const handleLogin = async () => {
        const result = await signInWithPopup(auth, provider);
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        const user = result.user;
        dispatch(login({username: user.displayName, token}));
    };

    const handleLogout = async () => {
        const result = await signOut(auth);
        dispatch(logout());
    };

    return <Fragment>
        {!isLoggedIn && <button type='button' onClick={handleLogin}>Sign In with Google</button>}
        {isLoggedIn && <button type='button' onClick={handleLogout}>Sign Out</button>}
    </Fragment>
};

export default GoogleAuth;