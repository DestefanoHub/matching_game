import { useRef, Fragment, useEffect } from 'react';
import { Outlet, NavLink, useNavigate, useOutletContext } from 'react-router';

import CreateAccount from '../account/Create';
import EditAccount from '../account/Edit';
import LoginAccount from '../account/Login';
import { useAppSelector, useAppDispatch } from '../../utils/hooks';
import { selectUsername, selectLoginState, logout, checkSessionStorage, setSession } from '../../store/sessionSlice';

import styles from './Header.module.scss';

type ContextType = { showLogin: () => void };

export default function Header() {
    const createAccountModal = useRef<HTMLDialogElement | null>(null);
    const editAccountModal = useRef<HTMLDialogElement | null>(null);
    const loginAccountModal = useRef<HTMLDialogElement | null>(null);
    const playerName = useAppSelector(selectUsername);
    const isLoggedIn = useAppSelector(selectLoginState);

    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    useEffect(() => {
        const storedSession = checkSessionStorage();

        if(storedSession !== null) {
            dispatch(setSession(storedSession));
        }
    }, []);

    const handleLogin = () => {
        loginAccountModal.current?.showModal();
    }

    const handleSession = () => {
        if(isLoggedIn){
            dispatch(logout());
            navigate('/');
        }else{
            handleLogin();
        }
    };

    const handleCreateAccount = () => {
        createAccountModal.current?.showModal();
    };

    const handleEditAccount = () => {
        editAccountModal.current?.showModal();
    };

    const createAccountButton = <button type='button' onClick={handleCreateAccount}>
        Create Account
    </button>;

    const editAccountButton = <button type='button' onClick={handleEditAccount}>
        {playerName}
    </button>;

    return <Fragment>
        <CreateAccount modalRef={createAccountModal}/>
        <EditAccount modalRef={editAccountModal}/>
        <LoginAccount modalRef={loginAccountModal}/>
        <main className={styles.main}>
            <header className={styles.header}>
                <h1 className={styles.title}>Matching Game</h1>
                <nav className={styles.nav}>
                    <NavLink className={({isActive}) => isActive ? styles.active : ''} to={''}>Home</NavLink>
                    <NavLink className={({isActive}) => isActive ? styles.active : ''} to={'game'}>Play</NavLink>
                    <NavLink className={({isActive}) => isActive ? styles.active : ''} to={'history'}>History</NavLink>
                </nav>
                <div className={styles.account}>
                    <span>Account:</span> {isLoggedIn ? editAccountButton : createAccountButton}
                    <button type='button' onClick={handleSession}>{isLoggedIn ? 'Logout' : 'Login'}</button>
                </div>
            </header>
            <section className={styles.content}>
                <Outlet context={{ showLogin: handleLogin } as ContextType}/>
            </section>
        </main>
    </Fragment>;
}

export function useShowLogin(){
    return useOutletContext<ContextType>();
}