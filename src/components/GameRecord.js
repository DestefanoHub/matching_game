import { getDisplayDifficulty } from '../store/gameSlice';

import styles from './GameRecord.module.css';

const GameRecord = (props) => {
    const gameDateObj = new Date(props.gameInfo.date);
    
    return <div className={`${styles.record} ${props.gameInfo.hasWon ? styles.win : styles.loss}`}>
        <p>Player {props.gameInfo.player} {props.gameInfo.hasWon ? 'won' : 'lost'} a {getDisplayDifficulty(props.gameInfo.difficulty)} game</p>
        <p>on {gameDateObj.toLocaleString('en-US')}</p>
        <p>with a score of {props.gameInfo.points} of {props.gameInfo.totalPoints} in {props.gameInfo.time} seconds!</p>
    </div>;
};

export default GameRecord;