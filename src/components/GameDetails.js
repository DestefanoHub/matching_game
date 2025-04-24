import Modal from './Modal';
import { getDisplayDifficulty } from '../store/gameSlice';

const GameDetails = ({ modalRef, gameDetails }) => {
    if('game' in gameDetails){
        const gameDateObj = new Date(gameDetails.game.date);

        return <Modal modalRef={modalRef}>
            <h1>Game Details</h1>
            <p>Player: {gameDetails.game.player}</p>
            <p>Status: {gameDetails.game.hasWon ? 'Win! :)' : 'Loss :('}</p>
            <p>Difficulty: {getDisplayDifficulty(gameDetails.game.difficulty)}</p>
            <p>Timestamp: {gameDateObj.toLocaleString('en-US')}</p>
            <p>Score: {gameDetails.game.points} of {gameDetails.game.totalPoints}</p>
            {gameDetails.game.hasWon && <p>Time: {gameDetails.game.time} seconds</p>}
        </Modal>;
    }

    return;
};

export default GameDetails;