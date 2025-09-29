import { useEffect, useRef, useState, Fragment } from 'react';
import { useAppSelector, useAppDispatch } from '../utils/hooks';

import { selectGames, selectIsLoaded, getGamesThunk } from '../store/historySlice';
import { getGameInfo } from '../utils/gateway';
import GameSearch from '../components/history/GameSearch';
import GameHistoryRecord from '../components/history/GameHistoryRecord';
import Paginator from '../components/generic/Paginator';
import Banner from '../components/generic/Banner';
import GameHistoryFull from '../components/history/GameHistoryFull';

import styles from './History.module.css';

export default function History() {
    const [ gameDetails, setGameDetails ] = useState({});
    const games = useAppSelector(selectGames);
    const isLoaded = useAppSelector(selectIsLoaded);
    const gameDetailsModal = useRef(null);
    const wasRecordClicked = useRef(false);

    const dispatch = useAppDispatch();
    
    useEffect(() => {
        dispatch(getGamesThunk());
    }, [dispatch]);

    useEffect(() => {
        if(wasRecordClicked.current){
            gameDetailsModal.current.showModal();
        }
    }, [gameDetails]);

    const handleClick = async (gameId: string) => {
        const gameInfo = await getGameInfo(gameId);
        wasRecordClicked.current = true;
        setGameDetails(gameInfo); 
    };

    const gameList = games.map((game, index: number) => {
        return <GameHistoryRecord key={index} game={game} onClick={handleClick}/>;
    });

    const loadBanner = <Banner text='Loading...'/>;
    const noGamesBanner = <Banner text='No games...yet!'/>;
    const showNoGamesBanner = isLoaded && !games.length;

    return <Fragment>
        <GameHistoryFull modalRef={gameDetailsModal} details={gameDetails}/>
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
}