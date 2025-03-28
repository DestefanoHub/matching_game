import { Link } from 'react-router-dom';

import RecentGames from '../components/RecentGames';

import styles from './Home.module.css';

const Home = () => {
    return <section className={styles.page}>
        <div className={styles.content}>
            <h1>Home Page</h1>
            <p>
                Click on a tile to reveal the hidden word. Reveal two tiles to see if the words match. If they match, you score a 
                point and the tiles are removed. If not, the words are hidden again. Memorize the location of the words and 
                match all the word pairs to win! 
            </p>
            <div className={styles.nav}>
                <Link to={'game'}><button type='button'>Start New Game</button></Link>
                <Link to={'history'}><button type='button'>View Game History</button></Link>
            </div>
            <RecentGames/>
        </div>
    </section>;
}

export default Home;