import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { lose, selectPlayer, selectDisplayDifficulty } from '../store/gameSlice';

const GameInfo = () => {
    const [countdownState, setCountdownState] = useState(60);
    const player = useSelector(selectPlayer);
    const displayDifficulty = useSelector(selectDisplayDifficulty);
    const gameDispatch = useDispatch();

    useEffect(() => {
        const countdownInterval = setInterval(() => {
            setCountdownState((prevCountdown) => {
                if(prevCountdown === 0){
                    clearInterval(countdownInterval);
                    gameDispatch(lose());
                    return 0;
                }

                return prevCountdown - 1;
            });
        }, 1000);

        return () => clearInterval(countdownInterval);
    }, [gameDispatch]);
    
    return <div>
        <p>Player: {player}</p>
        <p>Difficulty: {displayDifficulty.toUpperCase()}</p>
        <p>Time remaining: {countdownState} seconds</p>
    </div>;
};

export default GameInfo;