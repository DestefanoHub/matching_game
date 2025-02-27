import { useState, useEffect } from 'react';

import GameRecord from './GameRecord';

import styles from './RecentGames.module.css';

const RecentGames = () => {
    const [ recentGames, setRecentGames ] = useState([]);
    
    useEffect(() => {
        (async () => {
            // const recentGamesQuery = await getRecentGames();
            const response = await fetch('http://localhost:3100/getRecentGames');
            const recentGames = await response.json();
            setRecentGames(recentGames);
        })()
    }, []);

    const gameList = recentGames.map((game, index) => {
        return <GameRecord key={index} gameInfo={game}/>;
    });
    
    return <div className={styles.list}>
        <h1>Top 5 recent games:</h1>
        {recentGames.length ? gameList : 'No games...yet!'}
    </div>;
};

export default RecentGames;