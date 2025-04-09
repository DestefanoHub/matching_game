import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { selectGames, selectIsLoaded, getGamesThunk } from '../store/historySlice';
import GameSearch from '../components/GameSearch';
import GameRecord from '../components/GameRecord';
import Paginator from '../components/Paginator';
import Banner from '../components/Banner';

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

    const loadBanner = <Banner text='Loading...'/>;
    const noGamesBanner = <Banner text='No games...yet!'/>;
    const showNoGamesBanner = isLoaded && !games.length;

    return <div className={styles.page}>
        <div className={styles.content}>
            <h1>Game History</h1>
            <GameSearch/>
            <Paginator/>
            {!isLoaded && loadBanner}
            {showNoGamesBanner && noGamesBanner}
            <div className={styles.list}>
                {!showNoGamesBanner ? gameList : ''}
            </div>
            <Paginator/>
        </div>
    </div>;
};

export default History;