import { useState, useEffect, useRef, Fragment } from 'react';

import GameHistoryRecord from './GameHistoryRecord';
import GameHistoryFull from './GameHistoryFull';
import Banner from '../generic/Banner';
import { getRecentGames, getGameInfo } from '../../utils/gateway';
import type { Game } from '../../utils/types';

import styles from './RecentGames.module.css';

export default function RecentGames() {
    const [ recentGamesData, setRecentGamesData ] = useState<{isLoaded: boolean, games: Game[]}>({
        isLoaded: false,
        games: []
    });
    const [ gameDetails, setGameDetails ] = useState({
        game: {},
        stats: {
            isFirstGame: false,
            isFirstWin: false,
            isFirstDiffGame: false,
            isFirstDiffWin: false,
            isFastestDiffTime: false
        }
    });
    const gameDetailsModal = useRef<HTMLDialogElement | null>(null);
    const wasRecordClicked = useRef(false);
    
    useEffect(() => {
        (async () => {
            const recentGames = await getRecentGames();
            setRecentGamesData({
                isLoaded: true,
                games: recentGames
            });
        })()
    }, []);

    useEffect(() => {
        if(wasRecordClicked.current){
            gameDetailsModal.current?.showModal();
        }
    }, [gameDetails]);

    const handleClick = async (gameId: string) => {
        const gameInfo = await getGameInfo(gameId);
        setGameDetails(gameInfo);
        wasRecordClicked.current = true;
    };

    const gameList = recentGamesData.games.map((game, index) => {
        return <GameHistoryRecord key={index} game={game} onClick={handleClick}/>;
    });
    
    return <Fragment>
        <GameHistoryFull modalRef={gameDetailsModal} details={gameDetails}/>
        <div className={styles.list}>
            <h1>Top 5 recent games:</h1>
            {!recentGamesData.isLoaded && <Banner text='Loading...'/>}
            {recentGamesData.isLoaded && (recentGamesData.games.length ? gameList : <Banner text='No games...yet!'/>)}
        </div>
    </Fragment>;
}