import { useSelector } from 'react-redux';

import { selectPlayer, selectDisplayDifficulty } from '../store/gameSlice';

const GameInfo = (props) => {
    const player = useSelector(selectPlayer);
    const displayDifficulty = useSelector(selectDisplayDifficulty);
    
    return <div>
        <p>Player: {player}</p>
        <p>Difficulty: {displayDifficulty.toUpperCase()}</p>
        <p>Time remaining: {props.countdown} seconds</p>
    </div>;
};

export default GameInfo;