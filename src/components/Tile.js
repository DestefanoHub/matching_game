import { useState } from 'react';

import { useGame, useGameDispatch } from '../store/GameContext';

import styles from './Tile.module.css';

const Tile = (props) => {
    const [isHovered, setIsHovered] = useState(false);
    const gameState = useGame();
    const gameDispatch = useGameDispatch();

    let isActive = false;
    
    const handleClick = (event) => {
        gameDispatch({
            type: 'reveal',
            id: props.id
        });
    };

    const handleMouseOver = (event) => {
        if(!isActive && gameState.activeTiles.length < 2){
            setIsHovered(true);
        }
    };

    const handleMouseOut = (event) => {
        setIsHovered(false);
    };

    const activeTile = gameState.activeTiles.find((tile) => {
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
        {isActive && props.value}
    </button>
};

export default Tile;