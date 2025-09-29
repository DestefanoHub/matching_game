import { useAppDispatch } from '../../utils/hooks';
import { useState } from 'react';

import { setup } from '../../store/gameSlice';

import Modal from '../generic/Modal';

import styles from './GameSetup.module.css';

type Props = {
    modalRef: React.RefObject<>
};

export default function GameSetup({ modalRef }: Props) {   
    const [state, setState] = useState({player: '', difficulty: 1});
    
    const dispatch = useAppDispatch();

    const handlePlayer = (event: React.ChangeEvent<HTMLInputElement>) => {
        setState({
            ...state,
            player: event.target.value
        });
    };

    const handleDifficulty = (event: React.ChangeEvent<HTMLInputElement>) => {
        setState({
            ...state,
            difficulty: +event.target.value
        });
    };

    const handleSubmit = (event: Event) => {
        event.preventDefault();
        dispatch(setup({player: state.player, difficulty: state.difficulty}));
        modalRef.current.close();
    };

    return <Modal modalRef={modalRef}>
        <div className={styles.form}>
            <h1>Select options for a new game</h1>
            <form className={styles.form} onSubmit={handleSubmit}>
                <div className={styles.formRow}>
                    <label htmlFor='player'>Player name: </label>
                    <input 
                        type='text'
                        id='player' 
                        value={state.player}
                        onChange={handlePlayer}
                        required
                        spellCheck='false'
                    />
                </div>
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