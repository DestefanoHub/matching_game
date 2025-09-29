import { useAppSelector } from '../../utils/hooks';

import { selectPlayer, selectDisplayDifficulty, selectTime } from '../../store/gameSlice';

export default function GameInfo() {
    const player = useAppSelector(selectPlayer);
    const displayDifficulty = useAppSelector(selectDisplayDifficulty);
    const time = useAppSelector(selectTime);
    
    return <div>
        <p>Player: {player}</p>
        <p>Difficulty: {displayDifficulty.toUpperCase()}</p>
        <p>Time remaining: {time} seconds</p>
    </div>;
}