import { useReducer } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { reveal, selectActiveTiles } from '../store/gameSlice';

import styles from './Tile.module.css';

const initialState = {
    isActive: false,
    isHovered: false
};

const tileReducer = (state, action) => {
    switch(action.type){
        case 'hover': {
            if(!state.isActive){
                return {
                    ...state,
                    isHovered: !state.isHovered
                };
            }

            return state;
        }
        case 'active': {
            return {
                isHovered: false,
                isActive: true
            };
        }
        default: {
            return state;
        }
    }
};

const Tile = (props) => {
    const [tileState, dispatch] = useReducer(tileReducer, initialState);
    const activeTiles = useSelector(selectActiveTiles);
    const gameDispatch = useDispatch();
    
    const handleClick = (event) => {
        dispatch({type: 'active'});
        gameDispatch(reveal(props.id));
        // if(!isActive && activeTiles.length < 2){
        //     gameDispatch(reveal(props.id));
        // }
    };

    const handleMouseOver = (event) => {
        dispatch({type: 'hover'});
    };

    const handleMouseOut = (event) => {
        dispatch({type: 'hover'});
    };

    // const activeTile = activeTiles.find((tile) => {
    //     return tile.id === props.id;
    // });

    // if(typeof activeTile !== 'undefined') {
    //     isActive = true;
    // }
    
    return <button id={props.id} 
        type='button'
        className={`${styles.tile} ${tileState.isHovered && styles.hover} ${tileState.isActive && styles.active}`}
        onClick={handleClick}
        onMouseOver={handleMouseOver}
        onMouseOut={handleMouseOut}
    >
        <span className={styles.text}>{tileState.isActive && props.value}</span>
    </button>
};

export default Tile;