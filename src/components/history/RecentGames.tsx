import { useState, useEffect, useRef, Fragment } from 'react';

import GameHistoryRecord from './GameHistoryRecord';
import GameHistoryFull from './GameHistoryFull';
import Banner from '../generic/Banner';
import { getRecentGames, getGameInfo } from '../../utils/gateway';
import type { Game } from '../../utils/types';
import { useAppSelector } from '../../utils/hooks';
import { selectLoginState, selectID } from '../../store/sessionSlice';

import styles from './RecentGames.module.css';

export default function RecentGames() {
    const isLoggedIn = useAppSelector(selectLoginState);
    const playerID = useAppSelector(selectID);
    const [ recentGamesData, setRecentGamesData ] = useState<{isLoaded: boolean, allGames: Game[], playerGames: Game[]}>({
        isLoaded: false,
        allGames: [],
        playerGames: []
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
            const recentGames = await getRecentGames(playerID);
            const playerGames = (typeof recentGames[1] === 'undefined') ? [] : recentGames[1];
            setRecentGamesData({
                isLoaded: true,
                allGames: recentGames[0],
                playerGames
            });
        })()
    }, [isLoggedIn]);

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

    const allRecentGames = recentGamesData.allGames.map((game, index) => {
        return <GameHistoryRecord key={index} game={game} onClick={handleClick}/>;
    });
    const playerRecentGames = recentGamesData.playerGames.map((game, index) => {
        return <GameHistoryRecord key={index} game={game} onClick={handleClick}/>;
    });

    const message = (typeof player === 'undefined') ? <h1>Top 5 Recent Games:</h1> : <h1>Your Top 5 Recent Games:</h1>
    
    return <Fragment>
        <GameHistoryFull modalRef={gameDetailsModal} details={gameDetails}/>
        <div className={styles.container}>
            {!recentGamesData.isLoaded && <Banner text='Loading...'/>}
            {recentGamesData.isLoaded && (recentGamesData.allGames.length ? <div className={styles.list}><h1>Top 5 Recent Games:</h1><div>{allRecentGames}</div></div> : <Banner text='No games...yet!'/>)}
            {(recentGamesData.isLoaded && isLoggedIn) && (recentGamesData.playerGames.length ? <div className={styles.list}><h1>Your Top 5 Recent Games:</h1><div>{playerRecentGames}</div></div> : <Banner text='No games...yet!'/>)}
        </div>
    </Fragment>;
}