import { useDispatch, useSelector } from 'react-redux';

import { selectSearch, selectWLFilter, selectDiffFilter, selectSort, search, wlFilter, diffFilter, sort, getGamesThunk } from '../store/historySlice';

const GameSearch = () => {
    const searchVal = useSelector(selectSearch);
    const wlFilterVal = useSelector(selectWLFilter);
    const diffFilterVal = useSelector(selectDiffFilter);
    const sortVal = useSelector(selectSort);

    const dispatch = useDispatch();

    const handleChangeSearch = (event) => {
        dispatch(search(event.target.value));
        handleSubmit();
    };

    const handleChangeWLFilter = (event) => {
        dispatch(wlFilter(event.target.value));
        handleSubmit();
    };

    const handleChangeDiffFilter = (event) => {
        dispatch(diffFilter(+event.target.value));
        handleSubmit();
    };

    const handleChangeSort = (event) => {
        dispatch(sort(event.target.value));
        handleSubmit();
    };
    
    const handleSubmit = async () => {
        dispatch(getGamesThunk());
    };
    
    return <form>
        <label>
            Player search:
            <input 
                type='text'
                id='search'
                value={searchVal}
                onChange={handleChangeSearch}
            />
        </label>
        <label>
            Win/Loss Filter:
            <select
                id='wlFilter'
                value={wlFilterVal}
                onChange={handleChangeWLFilter}
            >
                <option value='a'>All</option>
                <option value='w'>Win</option>
                <option value='l'>Loss</option>
            </select>
        </label>
        <label>
            Difficulty Filter:
            <select
                id='diffFilter'
                value={diffFilterVal}
                onChange={handleChangeDiffFilter}
            >
                <option value='0'>All</option>
                <option value='1'>Easy</option>
                <option value='2'>Normal</option>
                <option value='3'>Hard</option>
            </select>
        </label>
        <label>
            Sorting:
            <select
                id='sort'
                value={sortVal}
                onChange={handleChangeSort}
            >
                <option value='dd'>Date Desc</option>
                <option value='da'>Date Asc</option>
                <option value='sd'>Score Desc</option>
                <option value='sa'>Score Asc</option>
            </select>
        </label>
    </form>;
};

export default GameSearch;