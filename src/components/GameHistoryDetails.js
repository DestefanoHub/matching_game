import { Fragment } from 'react';

import { getDisplayDifficulty } from '../store/gameSlice';

const GameHistoryDetails = ({ details }) => {
    const gameDateObj = new Date(details?.date);

    return <Fragment>
        <h1>Game Details</h1>
        <p>Player: {details?.player}</p>
        <p>Status: {details?.hasWon ? 'Win! :)' : 'Loss :('}</p>
        <p>Difficulty: {getDisplayDifficulty(details?.difficulty)}</p>
        <p>Timestamp: {gameDateObj.toLocaleString('en-US')}</p>
        <p>Score: {details?.points} of {details?.totalPoints}</p>
        {details?.hasWon && <p>Time: {details?.time} seconds</p>}
    </Fragment>
};

export default GameHistoryDetails;