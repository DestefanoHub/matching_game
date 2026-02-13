import { useAppSelector } from '../../utils/hooks';
import { type RefObject } from 'react';

import { selectHasWon } from '../../store/gameSlice';

import Modal from '../generic/Modal';

type Props = {
    modalRef: RefObject<HTMLDialogElement | null>,
    onClose: () => void
};

export default function GameOver({ modalRef, onClose }: Props) {    
    const hasWon = useAppSelector(selectHasWon);
    
    const winMessage = 'Congrats, you won!';
    const loseMessage = 'Sorry, you lost';
    const winNewGameText = 'New Game';
    const loseNewGameText = 'Try Again';

    const handleClick = () => {
        modalRef.current?.close();
    };

    return <Modal modalRef={modalRef} onClose={onClose} title='Game Over!'>
        <h2>{hasWon ? winMessage : loseMessage}</h2>
        <button type='button' onClick={handleClick}>{hasWon ? winNewGameText : loseNewGameText}</button>
    </Modal>;
}