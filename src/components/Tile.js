import { useSelector, useDispatch } from 'react-redux';

import { reveal, selectActiveTiles } from '../store/gameSlice';

import styles from './Tile.module.css';

const Tile = (props) => {
    const activeTiles = useSelector(selectActiveTiles);
    const dispatch = useDispatch();

    const handleClick = (event) => {        
        if(activeTiles.length < 2){
            dispatch(reveal(props.tile.id));
        }
    };

    return <button id={props.tile.id} 
        type='button'
        className={`${styles.tile} ${props.tile.isActive && styles.active} ${props.tile.isScored && styles.scored}`}
        onClick={handleClick}
    >
        <span>{props.tile.isActive && props.tile.value}</span>
    </button>
};

export default Tile;