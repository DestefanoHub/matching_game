import { useRef, Fragment } from 'react';
import { Outlet, NavLink } from 'react-router';

import CreateAccount from '../account/Create';
import EditAccount from '../account/Edit';

import styles from './Header.module.css';

export default function Header() {
    const createAccountModal = useRef<HTMLDialogElement | null>(null);
    const editAccountModal = useRef<HTMLDialogElement | null>(null);

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        createAccountModal.current?.showModal();
    };

    return <Fragment>
        <CreateAccount modalRef={createAccountModal}/>
        {/* <EditAccount modalRef={editAccountModal}/> */}
        <main className={styles.main}>
            <header className={styles.header}>
                <h1 className={styles.title}>Matching Game</h1>
                <nav className={styles.nav}>
                    <button type='button'><NavLink to={''}>Home</NavLink></button>
                    <button type='button'><NavLink to={'game'}>New Game</NavLink></button>
                    <button type='button'><NavLink to={'history'}>History</NavLink></button>
                </nav>
                <div className={styles.account}>
                    <span>Account: NOONE</span>
                    <button type='button' onClick={handleClick}>LOGIN</button>
                </div>
            </header>
            <section className={styles.content}>
                <Outlet/>
            </section>
        </main>
    </Fragment>;
}