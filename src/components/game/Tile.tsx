import { useSelector, useDispatch } from 'react-redux';

import { reveal, selectActiveTiles } from '../../store/gameSlice';
import { type Tile } from '../../utils/types';

import styles from './Tile.module.css';

type Props = {
    tile: Tile
}

export default function Tile({ tile }: Props) {
    const activeTiles = useSelector(selectActiveTiles);
    const dispatch = useDispatch();

    const handleClick = () => {        
        if(activeTiles.length < 2){
            dispatch(reveal(tile.id));
        }
    };

    return <button id={tile.id.toString()} 
        type='button'
        className={`${styles.tile} ${tile.isActive && styles.active} ${tile.isScored && styles.scored}`}
        onClick={handleClick}
    >
        <span>{tile.isActive && tile.value}</span>
    </button>
}