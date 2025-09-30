import { Fragment } from 'react';

import { getDisplayDifficulty } from '../../store/gameSlice';
import type { Game, Difficulty, PlayerStats } from '../../utils/types';

type Props = {
    game: Game,
    stats: PlayerStats,
    isCurrentPlayer?: boolean
};

export default function GameHistoryStats({ game, stats, isCurrentPlayer = false }: Props) {
    let firstGameMsg;
    let firstWinMsg;
    let firstDiffGameMsg;
    let firstDiffWinMsg;
    let fastestDiffTimeMsg;
    const playerName = isCurrentPlayer ? 'your' : game.player + "'s";
    const displayDifficulty = getDisplayDifficulty(game.difficulty as Difficulty);
    
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

    if(stats.isFastestDiffTime){
        fastestDiffTimeMsg = `Keep it up, this was ${playerName} fastest win on ${displayDifficulty}!`;
    }

    return <Fragment>
        <h1>Game Stats</h1>
        {firstGameMsg && <p>{firstGameMsg}</p>}
        {firstWinMsg && <p>{firstWinMsg}</p>}
        {firstDiffGameMsg && <p>{firstDiffGameMsg}</p>}
        {firstDiffWinMsg && <p>{firstDiffWinMsg}</p>}
        {fastestDiffTimeMsg && <p>{fastestDiffTimeMsg}</p>}
    </Fragment>;
}