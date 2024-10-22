import { useSelector, useDispatch } from 'react-redux';

import { score, clear, selectActiveTiles, selectTiles, selectHasWon } from '../store/gameSlice';
import Tile from './Tile';

import styles from './GameBoard.module.css';

const GameBoard = () => {
    const tiles = useSelector(selectTiles);
    const activeTiles = useSelector(selectActiveTiles);
    const hasWon = useSelector(selectHasWon);
    const gameDispatch = useDispatch();

    if(activeTiles.length === 2){
        if(activeTiles[0].value === activeTiles[1].value){
            gameDispatch(score());
        }else{
            gameDispatch(clear());
        }
    }

    const tileGrid = tiles.map((tile) => {
        return <Tile key={tile.id} tile={tile}/>
    });

    // if(hasWon){
    //     alert('You have won!');
    // }
    
    return <div className={`${styles.board} ${activeTiles.length === 2 && styles.blocker}`}>
        {tileGrid}
    </div>;
};

export default GameBoard;