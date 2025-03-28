import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { selectGames, selectIsLoaded } from '../store/historySlice';
import { getGamesThunk } from '../store/historySlice';
import GameSearch from '../components/GameSearch';
import GameRecord from '../components/GameRecord';
import Paginator from '../components/Paginator';
import Background from '../components/Background';

import styles from './History.module.css';

const History = () => {
    const games = useSelector(selectGames);
    const isLoaded = useSelector(selectIsLoaded);

    const dispatch = useDispatch();
    
    useEffect(() => {
        dispatch(getGamesThunk());
    }, [dispatch]);

    const gameList = games.map((game, index) => {
        return <GameRecord key={index} gameInfo={game}/>;
    });

    return <div className={styles.page}>
        <Background/>
        <div className={styles.content}>
            <h1>Game History</h1>
            <GameSearch/>
            <Paginator/>
            <div>
                {!isLoaded && 'Loading...'}
                <div className={styles.list}>
                    {isLoaded && (games.length ? gameList : 'No games...yet!')}
                </div>
            </div>
            <Paginator/>
        </div>
        <Background/>
    </div>;
};

export default History;