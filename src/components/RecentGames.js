import { useState, useEffect, useRef, Fragment } from 'react';

import GameRecord from './GameRecord';
import Banner from './Banner';
import GameDetails from './GameDetails';
import { getRecentGames, getGameInfo } from '../utils/gateway';

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
        return <GameRecord key={index} gameInfo={game} onClick={handleClick}/>;
    });
    
    return <Fragment>
        <GameDetails modalRef={gameDetailsModal} gameDetails={gameDetails}/>
        <div className={styles.list}>
            <h1>Top 5 recent games:</h1>
            {!recentGamesData.isLoaded && <Banner text='Loading...'/>}
            {recentGamesData.isLoaded && (recentGamesData.games.length ? gameList : <Banner text='No games...yet!'/>)}
        </div>
    </Fragment>;
};

export default RecentGames;