import Modal from '../generic/Modal';
import GameHistoryStats from './GameHistoryStats';
import { getDisplayDifficulty } from '../../store/gameSlice';

type Props = {
    modalRef: any,
    details: any
}

export default function GameHistoryFull({ modalRef, details }: Props) {
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
}