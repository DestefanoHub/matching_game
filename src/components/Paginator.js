import { useSelector, useDispatch } from 'react-redux';

import { selectTotalGames, selectPage, getGamesThunk } from '../store/historySlice';

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
    
    return <div>
        <button disabled={prevDisabled} onClick={handlePrev}>Prev</button>
        <button disabled={nextDisabled} onClick={handleNext}>Next</button>
        <h1>Page {page} of {!totalPages ? 1 : totalPages}</h1>
    </div>;
};

export default Paginator;