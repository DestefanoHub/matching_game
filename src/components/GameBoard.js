import Tile from './Tile';

import styles from './GameBoard.module.css';

const GameBoard = () => {
    const tileGrid = [];
    
    for(let i = 0; i < 9; i++){
        tileGrid.push(<Tile key={i} tileNum={i}/>);
    }
    
    return <div className={styles.board}>
        {tileGrid}
    </div>;
};

export default GameBoard;