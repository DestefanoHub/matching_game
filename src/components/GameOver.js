import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

 import { selectHasWon } from '../store/gameSlice';

import Modal from './Modal';

const GameOver = (props) => {    
    const hasWon = useSelector(selectHasWon);

    const navigate = useNavigate();
    
    const winMessage = 'Congrats, you won!';
    const loseMessage = 'Sorry, you lost';
    const winNewGameText = 'New Game';
    const loseNewGameText = 'Try Again';

    const handleClickNewGame = () => {
        props.modalRef.current.close();
        navigate('/game', {replace: true});
    };

    const handleClickHome =  () => {
        props.modalRef.current.close();
        navigate('/');
    };

    return <Modal modalRef={props.modalRef} onClose={props.onClose}>
        <h1>Game Over!</h1>
        <h2>{hasWon ? winMessage : loseMessage}</h2>
        <button type='button' onClick={handleClickNewGame}>{hasWon ? winNewGameText : loseNewGameText}</button>
        <button type='button' onClick={handleClickHome}>Home</button>
    </Modal>;
};

export default GameOver;