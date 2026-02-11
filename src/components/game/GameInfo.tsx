import { useAppSelector } from '../../utils/hooks';

import { selectDisplayDifficulty, selectTime } from '../../store/gameSlice';

export default function GameInfo() {
    const displayDifficulty = useAppSelector(selectDisplayDifficulty);
    const time = useAppSelector(selectTime);
    
    return <div>
        <p>Difficulty: {displayDifficulty.toUpperCase()}</p>
        <p>Time remaining: {time} seconds</p>
    </div>;
}