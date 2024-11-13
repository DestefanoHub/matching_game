import { useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import GameInfo from '../components/GameInfo';
import GameBoard from '../components/GameBoard';
import GameSetup from '../components/GameSetup';
import GameOver from '../components/GameOver';

import { init, selectInit, selectHasWon, selectGameOver } from '../store/gameSlice';

import styles from './Game.module.css';

const Main = () => {
    const initialized = useSelector(selectInit);
    const hasWon = useSelector(selectHasWon);
    const gameOver = useSelector(selectGameOver);
    const gameSetupModal = useRef(null);
    const gameOverModal = useRef(null);
    const navigate = useNavigate();
    const gameDispatch = useDispatch();

    useEffect(() => {
        gameDispatch(init());
    }, []);

    if(gameOver){
        gameOverModal.current.showModal();
    }

    const handleClick = () => {
        if(!initialized){
            gameSetupModal.current.showModal();
        }
    };

    const handleClose = (event) =>{
        navigate('game', {replace: true});
    };

    return <section className={styles.page}>
        <GameSetup modalRef={gameSetupModal}/>
        <GameOver modalRef={gameOverModal} onClose={handleClose} hasWon={hasWon}/>
        <p className={styles.title}>Matching Game</p>
        {!initialized && <button onClick={handleClick}>Start a new game!</button>}
        {initialized && <GameInfo/>}
        {initialized && <GameBoard/>}
    </section>;
};

export default Main;