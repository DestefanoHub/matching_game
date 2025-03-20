import { useState, useEffect } from 'react';

import GameRecord from './GameRecord';
import { getRecentGames } from '../utils/gateway';

import styles from './RecentGames.module.css';

const RecentGames = () => {
    const [ recentGamesData, setRecentGamesData ] = useState({
        isLoaded: false,
        games: []
    });
    
    useEffect(() => {
        (async () => {
            const recentGames = await getRecentGames();
            setRecentGamesData({
                isLoaded: true,
                games: recentGames
            });
        })()
    }, []);

    const gameList = recentGamesData.games.map((game, index) => {
        return <GameRecord key={index} gameInfo={game}/>;
    });
    
    return <div className={styles.list}>
        <h1>Top 5 recent games:</h1>
        {!recentGamesData.isLoaded && 'Loading...'}
        {recentGamesData.isLoaded && (recentGamesData.games.length ? gameList : 'No games...yet!')}
    </div>;
};

export default RecentGames;