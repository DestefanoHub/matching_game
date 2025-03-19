import { useState, useEffect } from 'react';

import GameRecord from './GameRecord';
import { getRecentGames } from '../utils/gateway';

import styles from './RecentGames.module.css';

const RecentGames = () => {
    const [ recentGames, setRecentGames ] = useState([]);
    
    useEffect(() => {
        (async () => {
            setRecentGames(await getRecentGames());
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