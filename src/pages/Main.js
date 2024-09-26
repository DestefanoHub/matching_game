import GameBoard from '../components/GameBoard';

import styles from './Main.module.css';

const Main = () => {
    return <section className={styles.page}>
        <p className={styles.title}>Matching Game</p>
        <GameBoard/>
    </section>;
};

export default Main;