import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { selectWLFilter, selectDiffFilter, selectSort, searchThunk, wlFilterThunk, diffFilterThunk, sortThunk } from '../store/historySlice';

const GameSearch = () => {
    const [ searchValLocal, setSearchValLocal ] = useState('');
    const wlFilterVal = useSelector(selectWLFilter);
    const diffFilterVal = useSelector(selectDiffFilter);
    const sortVal = useSelector(selectSort);

    const dispatch = useDispatch();

    useEffect(() => {
        let searchDelayTimeout = null;

        if(searchValLocal.length){
            searchDelayTimeout = setTimeout(() => {
                dispatch(searchThunk(searchValLocal));
            }, 750);
        }

        return () => {
            clearTimeout(searchDelayTimeout);
        };
    }, [searchValLocal, dispatch]);

    const handleChangeSearch = (event) => {
        setSearchValLocal(event.target.value);
    };

    const handleChangeWLFilter = (event) => {
        dispatch(wlFilterThunk(event.target.value));
    };

    const handleChangeDiffFilter = (event) => {
        dispatch(diffFilterThunk(+event.target.value));
    };

    const handleChangeSort = (event) => {
        dispatch(sortThunk(event.target.value));
    };
    
    return <form>
        <label>
            Player search:
            <input 
                type='text'
                id='search'
                value={searchValLocal}
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