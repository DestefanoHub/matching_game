import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { selectGames } from '../store/historySlice';
import { getGamesThunk } from '../store/historySlice';
import GameSearch from '../components/GameSearch';
import GameRecord from '../components/GameRecord';

import styles from './History.module.css';

const History = () => {
    const games = useSelector(selectGames);

    const dispatch = useDispatch();
    
    useEffect(() => {
        dispatch(getGamesThunk());
    }, [dispatch]);

    const gameList = games.map((game, index) => {
        return <GameRecord key={index} gameInfo={game}/>;
    });

    return <div className={styles.page}>
        <h1>Game History</h1>
        <GameSearch/>
        <div className={styles.content}>
            <div className={styles.list}>
                {games.length ? gameList : 'No games...yet!'}
            </div>
        </div>
    </div>;
};

export default History;