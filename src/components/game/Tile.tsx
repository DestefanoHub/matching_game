import { useAppSelector, useAppDispatch } from '../../utils/hooks';

import { reveal, selectActiveTiles } from '../../store/gameSlice';
import { type Tile } from '../../utils/types';

import styles from './Tile.module.scss';

type Props = {
    tile: Tile
};

export default function Tile({ tile }: Props) {
    const activeTiles = useAppSelector(selectActiveTiles);
    const dispatch = useAppDispatch();

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