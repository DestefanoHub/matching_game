import { useReducer } from 'react';

import { useGame, useGameDispatch } from '../store/GameContext';

import styles from './Tile.module.css';

const initialState = {
    active: false,
    hovered: false
};

const tileReducer = (state, action) => {
    switch(action.type){
        case 'active': {
            return {
                ...state,
                active: !state.active
            }
        }
        case 'hover':{
            if(!state.active && action.activeCount < 2){
                return {
                    ...state,
                    hovered: !state.hovered
                }
            }

            return state;
        }
        default: return state;
    }
};

const Tile = (props) => {
    const [state, tileDispatch] = useReducer(tileReducer, initialState);
    const gameState = useGame();
    const gameDispatch = useGameDispatch();
    
    const handleClick = (event) => {
        gameDispatch({
            type: 'reveal',
            id: props.id
        });
    };

    const handleMouseOver = (event) => {
        tileDispatch({
            type: 'hover',
            activeCount: gameState.activeTiles.length
        });
    };

    const handleMouseOut = (event) => {
        tileDispatch({
            type: 'hover',
            activeCount: gameState.activeTiles.length
        });
    };

    const activeTile = gameState.activeTiles.find((tile) => {
        return tile.id === props.id;
    });

    if(typeof activeTile !== 'undefined') {
        tileDispatch({type: 'active'});
    }
    
    return <button id={props.id} 
        type='button'
        className={`${styles.tile} ${state.hovered && styles.hover} ${state.active && styles.active}`}
        onClick={handleClick}
        onMouseOver={handleMouseOver}
        onMouseOut={handleMouseOut}
    >
        {state.active && props.value}
    </button>
};

export default Tile;