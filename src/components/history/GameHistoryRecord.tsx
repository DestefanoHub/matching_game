import { getDisplayDifficulty } from '../../store/gameSlice';
import { type Game, type Difficulty } from '../../utils/types';

import styles from './GameHistoryRecord.module.css';

type Props = {
    game: Game,
    onClick: Function
}

export default function GameHistoryRecord({ game, onClick }: Props) {
    const gameDateObj = new Date(game.date);
    
    const handleClick = () => {
        onClick(game._id);
    };

    return <div className={`${styles.record} ${game.hasWon ? styles.win : styles.loss}`} onClick={handleClick}>
        <h1>Game Details</h1>
        <p>{game.player} {game.hasWon ? 'won :)' : 'lost :('} a {getDisplayDifficulty(game.difficulty as Difficulty)} game on {gameDateObj.toLocaleString('en-US')}</p>
    </div>;
}