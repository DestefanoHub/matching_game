import { useSelector, useDispatch } from 'react-redux';

import { score, clear, selectActiveTiles, selectTiles, selectHasWon } from '../store/gameSlice';
import Tile from './Tile';

import styles from './GameBoard.module.css';

const GameBoard = () => {
    const tiles = useSelector(selectTiles);
    const activeTiles = useSelector(selectActiveTiles);
    const hasWon = useSelector(selectHasWon);
    const gameDispatch = useDispatch();

    const tileGrid = tiles.map((tile) => {
        return <Tile key={tile.id} id={tile.id} value={tile.value}/>
    });

    if(hasWon){
        alert('You have won!');
    }

    if(activeTiles.length === 2){
        if(activeTiles[0].value === activeTiles[1].value){
            gameDispatch(score());
        }else{
            gameDispatch(clear());
        }
    }
    
    return <div className={styles.board}>
        {tileGrid}
    </div>;
};

export default GameBoard;