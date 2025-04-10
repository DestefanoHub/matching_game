import { useSelector } from 'react-redux';

import { selectHasWon, selectSavedGame } from '../store/gameSlice';
import GameRecord from './GameRecord';

import Modal from './Modal';

const GameOver = (props) => {    
    const hasWon = useSelector(selectHasWon);
    const savedGame = useSelector(selectSavedGame);
    
    const winMessage = 'Congrats, you won!';
    const loseMessage = 'Sorry, you lost';
    const winNewGameText = 'New Game';
    const loseNewGameText = 'Try Again';

    const handleClick = () => {
        props.modalRef.current.close();
    };

    return <Modal modalRef={props.modalRef} onClose={props.onClose}>
        <h1>Game Over!</h1>
        <h2>{hasWon ? winMessage : loseMessage}</h2>
        <GameRecord gameInfo={savedGame}/>
        <button type='button' onClick={handleClick}>{hasWon ? winNewGameText : loseNewGameText}</button>
    </Modal>;
};

export default GameOver;