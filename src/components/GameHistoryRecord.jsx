import GameHistoryDetails from './GameHistoryDetails';

import styles from './GameHistoryRecord.module.css';

const GameHistoryRecord = ({ info, onClick }) => {
    const handleClick = () => {
        onClick(info._id);
    };

    return <div className={`${styles.record} ${info.hasWon ? styles.win : styles.loss}`} onClick={handleClick}>
        <GameHistoryDetails details={info}/>
    </div>;
};

export default GameHistoryRecord;