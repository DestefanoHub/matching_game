import { useAppSelector } from '../../utils/hooks';
import { type RefObject } from 'react';

import { selectHasWon, selectGameSaved } from '../../store/gameSlice';

import Modal from '../generic/Modal';

import styles from './GameOver.module.scss';

type Props = {
    modalRef: RefObject<HTMLDialogElement | null>,
    onClose: () => void
};

export default function GameOver({ modalRef, onClose }: Props) {    
    const hasWon = useAppSelector(selectHasWon);
    const gameSaved = useAppSelector(selectGameSaved);
    
    const winMessage = 'Congrats, you won!';
    const loseMessage = 'Sorry, you lost';
    const winNewGameText = 'New Game';
    const loseNewGameText = 'Try Again';

    const handleClick = () => {
        modalRef.current?.close();
    };

    return <Modal modalRef={modalRef} onClose={onClose} title='Game Over!'>
        <div className={styles.display}>
            <h2>{hasWon ? winMessage : loseMessage}</h2>
            {!gameSaved && <h2>An error has prevented this game from being saved.</h2>}
            <button type='button' className={styles.formButton} onClick={handleClick}>{hasWon ? winNewGameText : loseNewGameText}</button>
        </div>
    </Modal>;
}