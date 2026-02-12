import { useRef, Fragment } from 'react';
import { useAppSelector, useAppDispatch } from '../utils/hooks';
import { useNavigate } from 'react-router';

import GameBoard from '../components/game/GameBoard';
import GameSetup from '../components/game/GameSetup';
import GameOver from '../components/game/GameOver';
import { useShowLogin } from '../components/generic/Header';

import { init, decrementThunk, selectInit, selectTime, selectGameOver } from '../store/gameSlice';
import { selectLoginState } from '../store/sessionSlice';

import styles from './Game.module.scss';

export default function Game() {
    const initialized = useAppSelector(selectInit);
    const gameOver = useAppSelector(selectGameOver);
    const time = useAppSelector(selectTime);
    const isLoggedIn = useAppSelector(selectLoginState);

    const gameSetupModal = useRef<HTMLDialogElement | null>(null);
    const gameOverModal = useRef<HTMLDialogElement | null>(null);
    const countdownInterval = useRef<NodeJS.Timeout | null>(null);

    const { showLogin } = useShowLogin();

    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    let timeStyle = styles.timeStart;

    if(time <= 40 && time >= 21){
        timeStyle = styles.timeMid;
    }else if(time <= 20){
        timeStyle = styles.timeEnd;
    }
    
    const timeDisplay = <div className={styles.time}>
        <p className={timeStyle}>Time remaining: {time} seconds</p>
    </div>;

    if(gameOver){
        clearInterval(countdownInterval.current!);
        gameOverModal.current?.showModal();
    }

    const handleClick = () => {
        if(!isLoggedIn){
            showLogin();
            return;
        }
        
        if(!initialized){
            gameSetupModal.current?.showModal();
        }
    };

    const handleClose = () =>{
        dispatch(init());
        navigate('/game', {replace: true});
    };

    const startCountdown = () => {
        countdownInterval.current = setInterval(() => {
            dispatch(decrementThunk());
        }, 1000);
    };

    return <Fragment>
        <GameSetup modalRef={gameSetupModal}/>
        <GameOver modalRef={gameOverModal} onClose={handleClose}/>
        <section className={styles.page}>
            {!initialized && <button className={styles.start} onClick={handleClick}>Start a new game!</button>}
            {initialized && timeDisplay}
            {initialized && <GameBoard startCountdown={startCountdown}/>}
        </section>
    </Fragment>;
}