import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { reveal, selectActiveTiles } from '../store/gameSlice';

import styles from './Tile.module.css';

const Tile = (props) => {
    const [isHovered, setIsHovered] = useState(false);
    const activeTiles = useSelector(selectActiveTiles);
    const gameDispatch = useDispatch();

    let isActive = false;
    
    const handleClick = (event) => {
        gameDispatch(reveal(props.id));
    };

    const handleMouseOver = (event) => {
        if(!isActive && activeTiles.length < 2){
            setIsHovered(true);
        }
    };

    const handleMouseOut = (event) => {
        setIsHovered(false);
    };

    const activeTile = activeTiles.find((tile) => {
        return tile.id === props.id;
    });

    if(typeof activeTile !== 'undefined') {
        isActive = true;
    }
    
    return <button id={props.id} 
        type='button'
        className={`${styles.tile} ${isHovered && styles.hover} ${isActive && styles.active}`}
        onClick={handleClick}
        onMouseOver={handleMouseOver}
        onMouseOut={handleMouseOut}
    >
        <span className={styles.text}>{isActive && props.value}</span>
    </button>
};

export default Tile;