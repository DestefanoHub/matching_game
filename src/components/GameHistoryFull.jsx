import Modal from './Modal';
import GameHistoryStats from './GameHistoryStats';
import { getDisplayDifficulty } from '../store/gameSlice';

const GameHistoryFull = ({ modalRef, details }) => {
    if('game' in details){
        const gameDateObj = new Date(details.game.date);

        return <Modal modalRef={modalRef}>
            <h1>Game Details</h1>
            <p>Player: {details.game.player}</p>
            <p>Status: {details.game.hasWon ? 'Win! :)' : 'Loss :('}</p>
            <p>Difficulty: {getDisplayDifficulty(details.game.difficulty)}</p>
            <p>Timestamp: {gameDateObj.toLocaleString('en-US')}</p>
            <p>Score: {details.game.points} of {details.game.totalPoints}</p>
            {details.game.hasWon && <p>Time: {details.game.time} seconds</p>}
            <GameHistoryStats game={details.game} stats={details.stats}/>
        </Modal>;
    }

    return;
};

export default GameHistoryFull;