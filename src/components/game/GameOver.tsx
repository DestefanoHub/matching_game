import { useAppSelector } from '../../utils/hooks';
import { type RefObject } from 'react';

import { selectHasWon, selectGameSaved } from '../../store/gameSlice';

import Modal from '../generic/Modal';
import Banner from '../generic/Banner';

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
            <Banner text={hasWon ? winMessage : loseMessage} style={hasWon ? 'success' : 'error'}/>
            {!gameSaved && <Banner text='An error has prevented this game from being saved' style='error'/>}
            <button type='button' className={styles.formButton} onClick={handleClick}>{hasWon ? winNewGameText : loseNewGameText}</button>
        </div>
    </Modal>;
}