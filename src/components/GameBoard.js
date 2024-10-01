import { useGame, GameProvider } from '../store/GameContext';
import Tile from './Tile';

import styles from './GameBoard.module.css';

const GameBoard = () => {
    const gameState = useGame();

    const tileGrid = gameState.tiles.map((tile) => {
        return <Tile key={tile.id} id={tile.id} value={tile.value}/>
    });
    
    return <div className={styles.board}>
        <GameProvider>
            {tileGrid}
        </GameProvider>
    </div>;
};

export default GameBoard;