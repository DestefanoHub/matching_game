import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { scoreThunk, selectInit, selectDisplayDifficulty, selectActiveTiles, selectTiles } from '../../store/gameSlice';
import Tile from './Tile';
import { type Tile as TileType } from '../../utils/types';

import styles from './GameBoard.module.css';

type Props = {
    startCountdown: Function
}

export default function GameBoard({ startCountdown }: Props) {
    const [playerHasStarted, setPlayerHasStarted] = useState(false);
    
    const initialized = useSelector(selectInit);
    const displayDifficulty = useSelector(selectDisplayDifficulty);
    const tiles = useSelector(selectTiles);
    const activeTiles = useSelector(selectActiveTiles);

    const dispatch = useDispatch();
    
    /*
    * Wait a brief time before updating the board, otherwise players will be unable to see the value of the
    * second tile they click on.
    */
    useEffect(() => {
        let tileShowTimeout = null;

        if(activeTiles.length === 2){
            tileShowTimeout = setTimeout(() => {dispatch(scoreThunk())}, 500);
        }

        return () => {
            clearTimeout(tileShowTimeout!);
        };
    }, [activeTiles, dispatch]);

    const handleClick = () => {
        if(!playerHasStarted){
            setPlayerHasStarted(true);
            startCountdown();
        }
    };

    const tileGrid = tiles.map((tile: TileType) => <Tile key={tile.id} tile={tile}/>);
    
    return <div id='gameboard' 
        className={`${styles.board} ${styles[displayDifficulty]} ${activeTiles.length === 2 && styles.blocker}`}
        onClick={handleClick}
    >
        {initialized && tileGrid}
    </div>;
}