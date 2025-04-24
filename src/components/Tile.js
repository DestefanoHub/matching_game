import { useSelector, useDispatch } from 'react-redux';

import { reveal, selectActiveTiles } from '../store/gameSlice';

import styles from './Tile.module.css';

const Tile = ({ tile }) => {
    const activeTiles = useSelector(selectActiveTiles);
    const dispatch = useDispatch();

    const handleClick = (event) => {        
        if(activeTiles.length < 2){
            dispatch(reveal(tile.id));
        }
    };

    return <button id={tile.id} 
        type='button'
        className={`${styles.tile} ${tile.isActive && styles.active} ${tile.isScored && styles.scored}`}
        onClick={handleClick}
    >
        <span>{tile.isActive && tile.value}</span>
    </button>
};

export default Tile;