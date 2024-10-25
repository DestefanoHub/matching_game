import { Link } from 'react-router-dom';

import styles from './Home.module.css';

const Home = () => {
    return <section className={styles.page}>
        <h1>Home Page</h1>
        <div className={styles.content}>
            <p>
                Click on a tile to reveal the hidden word. Reveal two tiles to see if the words match. If they match, you score a 
                point and the tiles are removed. If not, the words are hidden again. Memorize the location of the words and 
                match all the word pairs to win! 
            </p>
            <Link to={'game'}>Start New Game</Link>
        </div>
    </section>;
}

export default Home;