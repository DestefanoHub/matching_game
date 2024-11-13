import { useNavigate } from 'react-router-dom';

import Modal from './Modal';

const GameOver = (props) => {    
    const navigate = useNavigate();

    const winMessage = 'Congrats, you won!';
    const loseMessage = 'Sorry, you lost';
    const winNewGameText = 'New Game';
    const loseNewGameText = 'Try Again';

    const handleClickNewGame = () => {
        navigate('game', {replace: true});
    };

    const handleClickHome =  () => {
        navigate('/');
    };

    return <Modal modalRef={props.modalRef} onClose={props.onClose}>
        <h1>Game Over!</h1>
        <h2>{props.hasWon ? winMessage : loseMessage}</h2>
        <button type='button' onClick={handleClickNewGame}>{props.hasWon ? winNewGameText : loseNewGameText}</button>
        <button type='button' onClick={handleClickHome}>Home</button>
    </Modal>;
};

export default GameOver;