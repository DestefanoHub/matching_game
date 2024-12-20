import { useSelector, useDispatch } from 'react-redux';

import { selectTotalGames, selectPage, getGamesThunk } from '../store/historySlice';

import styles from './Paginator.module.css';

const Paginator = () => {
    const totalGames = useSelector(selectTotalGames);
    const page = useSelector(selectPage);

    const dispatch = useDispatch();

    const totalPages = Math.ceil(totalGames / 10);
    const prevDisabled = (page === 1) ? true : false;
    const nextDisabled = (page === totalPages) ? true : false;

    const handlePrev = (event) => {
        event.preventDefault();
        dispatch(getGamesThunk(page - 1));
    };

    const handleNext = (event) => {
        event.preventDefault();
        dispatch(getGamesThunk(page + 1));
    };
    
    return <div className={styles.navPane}>
        <button type='button' className={styles.navigate} disabled={prevDisabled} onClick={handlePrev}>Prev</button>
        <p className={styles.pages}>Page {page} of {!totalPages ? 1 : totalPages}</p>
        <button type='button' className={styles.navigate} disabled={nextDisabled} onClick={handleNext}>Next</button>
    </div>;
};

export default Paginator;