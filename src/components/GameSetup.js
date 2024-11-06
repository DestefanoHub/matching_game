import { useDispatch } from 'react-redux';
import { useState } from 'react';

import { setup } from '../store/gameSlice';

import Modal from './Modal';

import styles from './GameSetup.module.css';

const GameSetup = (props) => {   
    const gameDispatch = useDispatch();
    const [state, setState] = useState({player: '', difficulty: 1});

    const handlePlayer = (event) => {
        setState({
            ...state,
            player: event.target.value
        });
    };

    const handleDifficulty = (event) => {
        setState({
            ...state,
            difficulty: +event.target.value
        });
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        gameDispatch(setup({player: state.player, difficulty: state.difficulty}));
        props.modalRef.current.close();
    };

    return <Modal modalRef={props.modalRef}>
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
                    />
                </div>
                <div className={styles.formRow}>
                    <p className={styles.label}>Difficulty: </p>
                    <label>
                        <input 
                            type='radio'
                            id='easy'
                            name='difficulty'
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
};

export default GameSetup;