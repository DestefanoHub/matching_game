import { useGame, useGameDispatch } from '../store/GameContext';
import Tile from './Tile';

import styles from './GameBoard.module.css';

const GameBoard = () => {
    const gameState = useGame();
    const dispatch = useGameDispatch();

    const tileGrid = gameState.tiles.map((tile) => {
        return <Tile key={tile.id} id={tile.id} value={tile.value}/>
    });

    if(gameState.hasWon){
        alert('You have won!');
    }

    if(gameState.activeTiles.length === 2){
        if(gameState.activeTiles[0].value === gameState.activeTiles[1].value){
            dispatch({
                type: 'score'
            });
        }
    }
    
    return <div className={styles.board}>
        {tileGrid}
    </div>;
};

export default GameBoard;