import { useSelector } from 'react-redux';

import { selectPlayer, selectDisplayDifficulty, selectTime } from '../../store/gameSlice';

const GameInfo = () => {
    const player = useSelector(selectPlayer);
    const displayDifficulty = useSelector(selectDisplayDifficulty);
    const time = useSelector(selectTime);
    
    return <div>
        <p>Player: {player}</p>
        <p>Difficulty: {displayDifficulty.toUpperCase()}</p>
        <p>Time remaining: {time} seconds</p>
    </div>;
};

export default GameInfo;