import { Fragment } from 'react';

import { getDisplayDifficulty } from '../store/gameSlice';

const GameHistoryStats = ({ details, stats, isCurrentPlayer = false }) => {
    let firstGameMsg;
    let firstWinMsg;
    let firstDiffGameMsg;
    let firstDiffWinMsg;
    let highestDiffScoreMsg;
    let fastestDiffTimeMsg;
    const playerName = isCurrentPlayer ? 'your' : details.player + "'s";
    const displayDifficulty = getDisplayDifficulty(details.difficulty);
    
    if(stats.isFirstGame){
        firstGameMsg = `Congrats, this was ${playerName} first game!`;
    }

    if(stats.isFirstWin){
        firstWinMsg = `Keep it up, this was ${playerName} first win!`;
    }

    if(stats.isFirstDiffGame){
        firstDiffGameMsg = `Way to go, this was ${playerName} first game on ${displayDifficulty}!`;
    }

    if(stats.isFirstDiffWin){
        firstDiffWinMsg = `Nice job, this was ${playerName} first win on ${displayDifficulty}!`;
    }

    if(stats.isHighestDiffScore){
        highestDiffScoreMsg = `Excellent game, this was ${playerName} highest score on ${displayDifficulty}!`;
    }

    if(stats.isFastestDiffTime){
        fastestDiffTimeMsg = `Keep it up, this was ${playerName} fastest win on ${displayDifficulty}!`;
    }

    return <Fragment>
        <h1>Game Stats</h1>
        {firstGameMsg && <p>{firstGameMsg}</p>}
        {firstWinMsg && <p>{firstWinMsg}</p>}
        {firstDiffGameMsg && <p>{firstDiffGameMsg}</p>}
        {firstDiffWinMsg && <p>{firstDiffWinMsg}</p>}
        {highestDiffScoreMsg && <p>{highestDiffScoreMsg}</p>}
        {fastestDiffTimeMsg && <p>{fastestDiffTimeMsg}</p>}
    </Fragment>;
};

export default GameHistoryStats;