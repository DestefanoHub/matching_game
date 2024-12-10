import { useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import GameInfo from '../components/GameInfo';
import GameBoard from '../components/GameBoard';
import GameSetup from '../components/GameSetup';
import GameOver from '../components/GameOver';

import { init, lose, selectInit, selectGameOver } from '../store/gameSlice';

import styles from './Game.module.css';

const Game = () => {
    const [countdown, setCountdown] = useState(60);

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
        setCountdown(60);
        navigate('/game', {replace: true});
    };

    const startCountdown = () => {
        countdownInterval.current = setInterval(() => {
            setCountdown((prevCountdown) => {
                if(prevCountdown === 0){
                    clearInterval(countdownInterval.current);
                    dispatch(lose());
                    return 0;
                }

                return prevCountdown - 1;
            });
        }, 1000);
    };

    return <section className={styles.page}>
        <GameSetup modalRef={gameSetupModal}/>
        <GameOver modalRef={gameOverModal} onClose={handleClose}/>
        <p className={styles.title}>Matching Game</p>
        {!initialized && <button onClick={handleClick}>Start a new game!</button>}
        {initialized && <GameInfo countdown={countdown}/>}
        {initialized && <GameBoard startCountdown={startCountdown}/>}
    </section>;
};

export default Game;