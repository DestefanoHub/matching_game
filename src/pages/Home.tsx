import RecentGames from '../components/history/RecentGames';
import { selectLoginState, selectID } from '../store/sessionSlice';
import { useAppSelector } from '../utils/hooks';

import styles from './Home.module.css';

export default function Home() {
    const isLoggedIn = useAppSelector(selectLoginState);
    const playerID = useAppSelector(selectID);

    return <section className={styles.content}>
        <h1>Home Page</h1>
        <p>
            Click on a tile to reveal the hidden word. Reveal two tiles to see if the words match. If they match, you score a 
            point and the tiles are removed. If not, the words are hidden again. Memorize the location of the words and 
            match all the word pairs to win! 
        </p>
        <div className={styles.history}>
            <RecentGames/>
            {isLoggedIn && <RecentGames player={playerID}/>}
        </div>
    </section>;
}