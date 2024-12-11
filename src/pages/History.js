import { useState, useEffect } from 'react';

import { getGames } from '../database';
import GameRecord from '../components/GameRecord';

import styles from './History.module.css';

const History = () => {
    const [ games, setGames ] = useState([]);
    
    useEffect(() => {
        (async () => {
            const gamesQuery = await getGames();
            setGames(gamesQuery);
        })()
    }, []);

    const gameList = games.map((game, index) => {
        return <GameRecord key={index} gameInfo={game}/>;
    });

    return <div className={styles.page}>
        <h1>Game History</h1>
        <div className={styles.content}>
            <div className={styles.list}>
                <h1>Top 5 recent games:</h1>
                {games.length ? gameList : 'No games...yet!'}
            </div>
        </div>
    </div>;
};

export default History;