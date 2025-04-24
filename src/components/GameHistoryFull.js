import Modal from './Modal';
import GameHistoryDetails from './GameHistoryDetails';
import GameHistoryStats from './GameHistoryStats';

const GameHistoryFull = ({ modalRef, details }) => {
    if('game' in details){
        return <Modal modalRef={modalRef}>
            <GameHistoryDetails details={details.game}/>
            <GameHistoryStats details={details.game} stats={details.stats}/>
        </Modal>;
    }

    return;
};

export default GameHistoryFull;