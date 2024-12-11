import { useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import GameInfo from '../components/GameInfo';
import GameBoard from '../components/GameBoard';
import GameSetup from '../components/GameSetup';
import GameOver from '../components/GameOver';

import { init, decrementThunk, selectInit, selectGameOver } from '../store/gameSlice';

import styles from './Game.module.css';

const Game = () => {
    const initialized = useSelector(selectInit);
    const gameOver = useSelector(selectGameOver);

    const gameSetupModal = useRef(null);
    const gameOverModal = useRef(null);
    const countdownInterval = useRef(null);

    const navigate = useNavigate();
    const dispatch = useDispatch();

    if(gameOver){
        clearInterval(countdownInterval.current);
        gameOverModal.current.showModal();
    }

    const handleClick = () => {
        if(!initialized){
            gameSetupModal.current.showModal();
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

    return <section className={styles.page}>
        <GameSetup modalRef={gameSetupModal}/>
        <GameOver modalRef={gameOverModal} onClose={handleClose}/>
        <h1>Matching Game</h1>
        {!initialized && <button onClick={handleClick}>Start a new game!</button>}
        {/* {initialized && <GameInfo countdown={countdown}/>} */}
        {initialized && <GameInfo/>}
        {initialized && <GameBoard startCountdown={startCountdown}/>}
    </section>;
};

export default Game;