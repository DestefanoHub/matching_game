import { useSelector } from 'react-redux';

import { selectRecentGames } from '../store/appSlice';
import GameRecord from './GameRecord';

import styles from './RecentGames.module.css';

const RecentGames = () => {
    const recentGames = useSelector(selectRecentGames);

    const gameList = recentGames.map((game, index) => {
        return <GameRecord key={index} gameInfo={game}/>;
    });
    
    return <div className={styles.list}>
        <h1>Top 5 recent games:</h1>
        {recentGames.length ? gameList : 'No games...yet!'}
    </div>;
};

export default RecentGames;