import { useGame, useGameDispatch } from '../store/GameContext';

import styles from './Tile.module.css';

const Tile = (props) => {
    const gameState = useGame();
    const dispatch = useGameDispatch();
    
    const handleClick = (event) => {
        dispatch({
            type: 'reveal',
            id: props.id
        });
    };
    
    return <button id={props.id} type='button' className={styles.tile} onClick={handleClick}>
        {props.value}
    </button>
};

export default Tile;