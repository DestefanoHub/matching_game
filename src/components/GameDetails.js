import Modal from './Modal';
import { getDisplayDifficulty } from '../store/gameSlice';

const GameDetails = (props) => {
    console.log(props);
    const gameDateObj = new Date(props.game.date);

    return <Modal modalRef={props.modalRef}>
        <h1>Game Details</h1>
        <p>Player: {props.game.player}</p>
        <p>Status: {props.game.hasWon ? 'Win! :)' : 'Loss :('}</p>
        <p>Difficulty: {getDisplayDifficulty(props.game.difficulty)}</p>
        <p>Timestamp: {gameDateObj.toLocaleString('en-US')}</p>
        <p>Score: {props.game.points} of {props.game.totalPoints}</p>
        {props.game.hasWon && <p>Time: {props.game.time} seconds</p>}
    </Modal>;
};

export default GameDetails;