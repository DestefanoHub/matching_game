import { useSelector, useDispatch } from 'react-redux';

import { score, clear, selectInit, selectDisplayDifficulty, selectActiveTiles, selectTiles } from '../store/gameSlice';
import Tile from './Tile';

import styles from './GameBoard.module.css';

const GameBoard = () => {
    const initialized = useSelector(selectInit);
    const displayDifficulty = useSelector(selectDisplayDifficulty);
    const tiles = useSelector(selectTiles);
    const activeTiles = useSelector(selectActiveTiles);
    const gameDispatch = useDispatch();
    
    /*
    * Wait a brief time before updating the board, otherwise players will be unable to see the value of the
    * second tile they click on.
    */
    if(activeTiles.length === 2){
        if(tiles[activeTiles[0]].value === tiles[activeTiles[1]].value){
            setTimeout(() => {gameDispatch(score())}, 500);
        }else{
            setTimeout(() => {gameDispatch(clear())}, 500);
        }
    }

    const tileGrid = tiles.map((tile) => {
        return <Tile key={tile.id} tile={tile}/>
    });
    
    return <div id='gameboard' className={`${styles.board} ${styles[displayDifficulty]} ${activeTiles.length === 2 && styles.blocker}`}>
        {initialized && tileGrid}
    </div>;
};

export default GameBoard;