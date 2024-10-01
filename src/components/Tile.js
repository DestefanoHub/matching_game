import { useState } from 'react';

import styles from './Tile.module.css';

const defaultState = {
    value: 'Unknown',
    clicked: false
};

const Tile = (props) => {
    const [tileState, setTileState] = useState(defaultState);
    
    const handleClick = (event) => {
        if(tileState.clicked){
            setTileState(defaultState);
        }else{
            setTileState({
                value: props.tileNum,
                clicked: true
            });
        }
    };
    
    return <button type='button' className={styles.tile} onClick={handleClick}>
        {tileState.value}
    </button>
};

export default Tile;