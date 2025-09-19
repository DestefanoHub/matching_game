import { useState, useEffect, useRef, Fragment } from 'react';

import GameHistoryRecord from './GameHistoryRecord';
import GameHistoryFull from './GameHistoryFull';
import Banner from '../generic/Banner';
import { getRecentGames, getGameInfo } from '../../utils/gateway';

import styles from './RecentGames.module.css';

const RecentGames = () => {
    const [ recentGamesData, setRecentGamesData ] = useState({
        isLoaded: false,
        games: []
    });
    const [ gameDetails, setGameDetails ] = useState({});
    const gameDetailsModal = useRef(null);
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
            gameDetailsModal.current.showModal();
        }
    }, [gameDetails]);

    const handleClick = async (gameId) => {
        const gameInfo = await getGameInfo(gameId);
        wasRecordClicked.current = true;
        setGameDetails(gameInfo); 
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
};

export default RecentGames;