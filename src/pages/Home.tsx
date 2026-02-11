import RecentGames from '../components/history/RecentGames';

import styles from './Home.module.scss';

export default function Home() {
    return <section className={styles.content}>
        <p className={styles.description}>
            <span className={styles.title}>Welcome to Matching Game</span>, a word-based memory game where you must match word pairs quickly to win! Click on a tile 
            to reveal the hidden word. Reveal two tiles to see if the words match. If they match, you score a point and the 
            tiles are removed. If not, the words are hidden again. Memorize the location of the words and match all the word 
            pairs to win! 
        </p>
        <RecentGames/>
    </section>;
}