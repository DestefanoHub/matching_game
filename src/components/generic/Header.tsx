import { useRef, Fragment } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router';

import CreateAccount from '../account/Create';
import EditAccount from '../account/Edit';
import LoginAccount from '../account/Login';
import { useAppSelector, useAppDispatch } from '../../utils/hooks';
import { selectUsername, selectLoginState, logout } from '../../store/sessionSlice';

import styles from './Header.module.css';

export default function Header() {
    const createAccountModal = useRef<HTMLDialogElement | null>(null);
    const editAccountModal = useRef<HTMLDialogElement | null>(null);
    const loginAccountModal = useRef<HTMLDialogElement | null>(null);
    const playerName = useAppSelector(selectUsername);
    const isLoggedIn = useAppSelector(selectLoginState);

    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const handleSession = (event: React.MouseEvent<HTMLButtonElement>) => {
        if(isLoggedIn){
            dispatch(logout());
            navigate('/');
        }else{
            loginAccountModal.current?.showModal();
        }
    };

    const handleCreateAccount = (event: React.MouseEvent<HTMLButtonElement>) => {
        createAccountModal.current?.showModal();
    };

    const handleEditAccount = (event: React.MouseEvent<HTMLButtonElement>) => {
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
                    <button type='button'><NavLink to={''}>Home</NavLink></button>
                    <button type='button'><NavLink to={'game'}>New Game</NavLink></button>
                    <button type='button'><NavLink to={'history'}>History</NavLink></button>
                </nav>
                <div className={styles.account}>
                    <span>Account: {isLoggedIn ? editAccountButton : createAccountButton}</span>
                    <button type='button' onClick={handleSession}>{isLoggedIn ? 'Logout' : 'Login'}</button>
                </div>
            </header>
            <section className={styles.content}>
                <Outlet/>
            </section>
        </main>
    </Fragment>;
}