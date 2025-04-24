import { getDisplayDifficulty } from '../store/gameSlice';

import styles from './GameRecord.module.css';

const GameRecord = ({ gameInfo, onClick }) => {
    const gameDateObj = new Date(gameInfo.date);

    const handleClick = () => {
        onClick(gameInfo._id);
    };

    return <div className={`${styles.record} ${gameInfo.hasWon ? styles.win : styles.loss}`} onClick={handleClick}>
        <p>Player: {gameInfo.player}</p>
        <p>Status: {gameInfo.hasWon ? 'Win! :)' : 'Loss :('}</p>
        <p>Difficulty: {getDisplayDifficulty(gameInfo.difficulty)}</p>
        <p>Timestamp: {gameDateObj.toLocaleString('en-US')}</p>
        <p>Score: {gameInfo.points} of {gameInfo.totalPoints}</p>
        {gameInfo.hasWon && (<p>Time: {gameInfo.time} seconds</p>)}
    </div>;
};

export default GameRecord;