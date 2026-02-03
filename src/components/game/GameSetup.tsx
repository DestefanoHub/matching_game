import { useAppDispatch, useAppSelector } from '../../utils/hooks';
import { useState, type RefObject } from 'react';

import { setup } from '../../store/gameSlice';
import type { Difficulty } from '../../utils/types';
import { selectUsername } from '../../store/sessionSlice';

import Modal from '../generic/Modal';

import styles from './GameSetup.module.scss';

type Props = {
    modalRef: RefObject<HTMLDialogElement | null>
};

export default function GameSetup({ modalRef }: Props) {   
    const playerName = useAppSelector(selectUsername);
    const [state, setState] = useState({difficulty: 1});
    
    const dispatch = useAppDispatch();

    const handleDifficulty = (event: React.ChangeEvent<HTMLInputElement>) => {
        setState({
            ...state,
            difficulty: +event.target.value
        });
    };

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        dispatch(setup({player: playerName, difficulty: state.difficulty as Difficulty}));
        modalRef.current?.close();
    };

    return <Modal modalRef={modalRef}>
        <div className={styles.form}>
            <h1>Select options for a new game</h1>
            <form className={styles.form} onSubmit={handleSubmit}>
                <div className={styles.formRow}>
                    <p className={styles.label}>Difficulty: </p>
                    <label>
                        <input 
                            type='radio'
                            id='easy'
                            name='difficulty'
                            required
                            value='1'
                            checked={state.difficulty === 1}
                            onChange={handleDifficulty}
                        />Easy
                    </label>
                    <label>
                        <input 
                            type='radio'
                            id='normal'
                            name='difficulty'
                            value='2'
                            checked={state.difficulty === 2}
                            onChange={handleDifficulty}
                        />Normal
                    </label>
                    <label>
                        <input
                            type='radio'
                            id='hard'
                            name='difficulty'
                            value='3'
                            checked={state.difficulty === 3}
                            onChange={handleDifficulty}
                        />Hard
                    </label>
                </div>
                <div className={styles.formRow}>
                    <button type='submit'>Start Game!</button>
                </div>
            </form>
        </div>
    </Modal>;
}