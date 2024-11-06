import { useSelector, useDispatch } from 'react-redux';
import { useRef, Fragment } from 'react';

import { score, clear, selectInit, selectPlayer, selectDifficulty, selectActiveTiles, selectTiles, selectHasWon } from '../store/gameSlice';
import Tile from './Tile';
import GameSetup from './GameSetup';

import styles from './GameBoard.module.css';

const getDisplayDifficulty = (diff) => {
    switch(diff){
        case 2: return 'normal';
        case 3: return 'hard';
        case 1:
        default: return 'easy';
    }
};

const GameBoard = () => {
    const initialized = useSelector(selectInit);
    const player = useSelector(selectPlayer);
    const difficulty = useSelector(selectDifficulty);
    const tiles = useSelector(selectTiles);
    const activeTiles = useSelector(selectActiveTiles);
    const hasWon = useSelector(selectHasWon);
    const gameDispatch = useDispatch();
    const modal = useRef(null);

    const displayDifficulty = getDisplayDifficulty(difficulty);

    const handleClick = (event) => {
        if(!initialized){
            modal.current.showModal();
        }
    };

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

    const gameInfo = <div>
        <p>Player: {player}</p>
        <p>Difficulty: {displayDifficulty.toUpperCase()}</p>
    </div>;

    const tileGrid = tiles.map((tile) => {
        return <Tile key={tile.id} tile={tile}/>
    });
    
    return <Fragment>
        <GameSetup modalRef={modal}/>
        {!initialized && <button onClick={handleClick}>Start a new game!</button>}
        {initialized && gameInfo}
        <div id='gameboard' className={`${styles.board} ${styles[displayDifficulty]} ${activeTiles.length === 2 && styles.blocker}`}>
            {initialized && tileGrid}
        </div>
    </Fragment>;
};

export default GameBoard;