import { useAppSelector } from '../../utils/hooks';
import { type Ref } from 'react';

import { selectHasWon } from '../../store/gameSlice';

import Modal from '../generic/Modal';

type Props = {
    modalRef: Ref<HTMLDialogElement>,
    onClose: () => void
};

export default function GameOver({ modalRef, onClose }: Props) {    
    const hasWon = useAppSelector(selectHasWon);
    
    const winMessage = 'Congrats, you won!';
    const loseMessage = 'Sorry, you lost';
    const winNewGameText = 'New Game';
    const loseNewGameText = 'Try Again';

    const handleClick = () => {
        modalRef?.current.close();
    };

    return <Modal modalRef={modalRef} onClose={onClose}>
        <h1>Game Over!</h1>
        <h2>{hasWon ? winMessage : loseMessage}</h2>
        <button type='button' onClick={handleClick}>{hasWon ? winNewGameText : loseNewGameText}</button>
    </Modal>;
}