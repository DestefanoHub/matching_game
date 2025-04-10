import { getDisplayDifficulty } from '../store/gameSlice';

import styles from './GameRecord.module.css';

const GameRecord = (props) => {
    const gameDateObj = new Date(props.gameInfo.date);

    const handleClick = () => {
        props.onClick(props.gameInfo._id);
    };

    return <div className={`${styles.record} ${props.gameInfo.hasWon ? styles.win : styles.loss}`} onClick={handleClick}>
        <p>Player: {props.gameInfo.player}</p>
        <p>Status: {props.gameInfo.hasWon ? 'Win! :)' : 'Loss :('}</p>
        <p>Difficulty: {getDisplayDifficulty(props.gameInfo.difficulty)}</p>
        <p>Timestamp: {gameDateObj.toLocaleString('en-US')}</p>
        <p>Score: {props.gameInfo.points} of {props.gameInfo.totalPoints}</p>
        {props.gameInfo.hasWon && <p>Time: {props.gameInfo.time} seconds</p>}
    </div>;
};

export default GameRecord;