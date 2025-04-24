import { useEffect, useRef, useState, Fragment } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { selectGames, selectIsLoaded, getGamesThunk } from '../store/historySlice';
import {  getGameInfo } from '../utils/gateway';
import GameSearch from '../components/GameSearch';
import GameRecord from '../components/GameRecord';
import Paginator from '../components/Paginator';
import Banner from '../components/Banner';
import GameDetails from '../components/GameDetails';

import styles from './History.module.css';

const History = () => {
    const [ gameDetails, setGameDetails ] = useState({});
    const games = useSelector(selectGames);
    const isLoaded = useSelector(selectIsLoaded);
    const gameDetailsModal = useRef(null);
    const wasRecordClicked = useRef(false);

    const dispatch = useDispatch();
    
    useEffect(() => {
        dispatch(getGamesThunk());
    }, [dispatch]);

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

    const gameList = games.map((game, index) => {
        return <GameRecord key={index} gameInfo={game} onClick={handleClick}/>;
    });

    const loadBanner = <Banner text='Loading...'/>;
    const noGamesBanner = <Banner text='No games...yet!'/>;
    const showNoGamesBanner = isLoaded && !games.length;

    return <Fragment>
        <GameDetails modalRef={gameDetailsModal} gameDetails={gameDetails}/>
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
    </Fragment>;
};

export default History;