import { useSelector, useDispatch } from 'react-redux';

import { score, clear, selectActiveTiles, selectTiles, selectHasWon } from '../store/gameSlice';
import Tile from './Tile';

import styles from './GameBoard.module.css';

const GameBoard = () => {
    const tiles = useSelector(selectTiles);
    const activeTiles = useSelector(selectActiveTiles);
    const hasWon = useSelector(selectHasWon);
    const gameDispatch = useDispatch();

    /*
    * Wait until the tile animations have completed before updating the board, otherwise players
    * will be unable to see the value of the second tile they click on.
    */
    const handleAnimationEnd = (event) => {
        if(activeTiles.length === 2 && event.target.className.includes('tile')){
            if(activeTiles[0].value === activeTiles[1].value){
                gameDispatch(score());
            }else{
                gameDispatch(clear());
            }
        }
    };

    const tileGrid = tiles.map((tile) => {
        return <Tile key={tile.id} tile={tile}/>
    });
    
    return <div id='gameboard'
        className={`${styles.board} ${activeTiles.length === 2 && styles.blocker}`}
        onAnimationEndCapture={handleAnimationEnd}
    >
        {tileGrid}
    </div>;
};

export default GameBoard;