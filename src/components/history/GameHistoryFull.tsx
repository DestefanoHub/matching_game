import { type RefObject } from 'react';

import Modal from '../generic/Modal';
import GameHistoryStats from './GameHistoryStats';
import { getDisplayDifficulty } from '../../store/gameSlice';
import type { Difficulty, Game, GameData } from '../../utils/types';

type Props = {
    modalRef: RefObject<HTMLDialogElement | null>,
    details: GameData
};

export default function GameHistoryFull({ modalRef, details }: Props) {
    if(Object.keys(details.game).length){
        const gameDateObj = new Date(details.game.date);

        return <Modal modalRef={modalRef} title='Game Details'>
            <p>Player: <span className='playerName'>{details.game.player.username}</span></p>
            <p>Status: {details.game.hasWon ? 'Win! :)' : 'Loss :('}</p>
            <p>Difficulty: {getDisplayDifficulty(details.game.difficulty as Difficulty)}</p>
            <p>Timestamp: {gameDateObj.toLocaleString('en-US')}</p>
            <p>Score: {details.game.points} of {details.game.totalPoints}</p>
            {details.game.hasWon && <p>Time: {details.game.time} seconds</p>}
            <GameHistoryStats game={details.game as Game} stats={details.stats}/>
        </Modal>;
    }

    return;
}