import { getDisplayDifficulty } from '../../store/gameSlice';

import styles from './GameHistoryRecord.module.css';

const GameHistoryRecord = ({ game, onClick }) => {
    const gameDateObj = new Date(game.date);
    
    const handleClick = () => {
        onClick(game._id);
    };

    return <div className={`${styles.record} ${game.hasWon ? styles.win : styles.loss}`} onClick={handleClick}>
        <h1>Game Details</h1>
        <p>{game.player} {game.hasWon ? 'won :)' : 'lost :('} a {getDisplayDifficulty(game?.difficulty)} game on {gameDateObj.toLocaleString('en-US')}</p>
    </div>;
};

export default GameHistoryRecord;