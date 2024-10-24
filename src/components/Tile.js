import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { reveal, selectActiveTiles } from '../store/gameSlice';

import styles from './Tile.module.css';

const Tile = (props) => {
    const [isHovered, setIsHovered] = useState(false);
    const activeTiles = useSelector(selectActiveTiles);
    const gameDispatch = useDispatch();

    const handleClick = (event) => {        
        if(activeTiles.length < 2){
            gameDispatch(reveal(props.tile.id));
        }
    };

    const handleMouseOver = (event) => {
        if(!props.tile.isActive){
            setIsHovered(true);
        }
    };

    const handleMouseOut = (event) => {
        if(!props.tile.isActive){
            setIsHovered(false);
        }
    };
    
    return <button id={props.tile.id} 
        type='button'
        className={`${styles.tile} ${isHovered && styles.hover} ${props.tile.isActive && styles.active} ${props.tile.isScored && styles.scored}`}
        onClick={handleClick}
        onMouseOver={handleMouseOver}
        onMouseOut={handleMouseOut}
    >
        <span className={`${styles.tileText}`}>{props.tile.isActive && props.tile.value}</span>
    </button>
};

export default Tile;