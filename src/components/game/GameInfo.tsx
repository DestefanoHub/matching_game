import { useSelector } from 'react-redux';

import { selectPlayer, selectDisplayDifficulty, selectTime } from '../../store/gameSlice';

export default function GameInfo() {
    const player = useSelector(selectPlayer);
    const displayDifficulty = useSelector(selectDisplayDifficulty);
    const time = useSelector(selectTime);
    
    return <div>
        <p>Player: {player}</p>
        <p>Difficulty: {displayDifficulty.toUpperCase()}</p>
        <p>Time remaining: {time} seconds</p>
    </div>;
}