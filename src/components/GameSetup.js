import { useDispatch } from 'react-redux';
import { useRef } from 'react';

import { setup } from '../store/gameSlice';

import Modal from './Modal';

import styles from './GameSetup.module.css';

const GameSetup = (props) => {   
    const gameDispatch = useDispatch();
    const playerRef = useRef(null);
    const difficultyRef = useRef(null);

    const handleSubmit = (event) => {
        event.preventDefault();
        const player = playerRef.current.value;
        const difficultyButtons = difficultyRef.current.querySelectorAll('input[type="radio"]');
        let difficulty = 1;
        
        difficultyButtons.forEach((radio) => {
            if(radio.checked){
                difficulty = radio.value;
            }
        });

        gameDispatch(setup({player, difficulty}));
        props.modalRef.current.close();
    };

    return <Modal modalRef={props.modalRef}>
        <div className={styles.form}>
            <h1>Select options for a new game</h1>
            <form className={styles.form} onSubmit={handleSubmit}>
                <div className={styles.formRow}>
                    <label htmlFor='player'>Player name: </label>
                    <input type='text' id='player' ref={playerRef}/>
                </div>
                <div className={styles.formRow} ref={difficultyRef}>
                    <p className={styles.label}>Difficulty: </p>
                    <label>
                        <input 
                            type='radio'
                            id='easy'
                            name='difficulty'
                            value='1'
                        />Easy
                    </label>
                    <label>
                        <input 
                            type='radio'
                            id='normal'
                            name='difficulty'
                            value='2'
                        />Normal
                    </label>
                    <label>
                        <input
                            type='radio'
                            id='hard'
                            name='difficulty'
                            value='3'
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