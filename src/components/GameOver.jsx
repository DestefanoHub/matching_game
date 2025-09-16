import { useSelector } from 'react-redux';

import { selectHasWon, selectSavedGame } from '../store/gameSlice';

import Modal from './Modal';
import GameHistoryStats from './GameHistoryStats';

const GameOver = ({ modalRef, isGameOver, onClose }) => {    
    const hasWon = useSelector(selectHasWon);
    const savedGame = useSelector(selectSavedGame);
    
    const winMessage = 'Congrats, you won!';
    const loseMessage = 'Sorry, you lost';
    const winNewGameText = 'New Game';
    const loseNewGameText = 'Try Again';

    const handleClick = () => {
        modalRef.current.close();
    };

    return <Modal modalRef={modalRef} onClose={onClose}>
        <h1>Game Over!</h1>
        <h2>{hasWon ? winMessage : loseMessage}</h2>
        <button type='button' onClick={handleClick}>{hasWon ? winNewGameText : loseNewGameText}</button>
        {/* {isGameOver && <GameHistoryStats game={savedGame.game} stats={savedGame.stats} isCurrentPlayer={true}/>} */}
    </Modal>;
};

export default GameOver;