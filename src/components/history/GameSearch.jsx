import { useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { selectWLFilter, selectDiffFilter, selectSort, searchThunk, wlFilterThunk, diffFilterThunk, sortThunk } from '../../store/historySlice';

import styles from './GameSearch.module.css';

const GameSearch = () => {
    const searchDelayTimeout = useRef(null);
    const [ searchValLocal, setSearchValLocal ] = useState('');
    const wlFilterVal = useSelector(selectWLFilter);
    const diffFilterVal = useSelector(selectDiffFilter);
    const sortVal = useSelector(selectSort);

    const dispatch = useDispatch();

    const handleChangeSearch = (event) => {
        setSearchValLocal(event.target.value);

        clearTimeout(searchDelayTimeout.current);

        searchDelayTimeout.current = setTimeout(() => {
            dispatch(searchThunk(event.target.value));
        }, 750);
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
    
    return <form className={styles.form}>
        <label htmlFor='search'>Player search:</label>
        <input 
            type='text'
            id='search'
            value={searchValLocal}
            onChange={handleChangeSearch}
            spellCheck='false'
        />
        
        <label htmlFor='wlFilter'>Win/Loss Filter:</label>
        <select
            id='wlFilter'
            value={wlFilterVal}
            onChange={handleChangeWLFilter}
        >
            <option value='a'>All</option>
            <option value='w'>Win</option>
            <option value='l'>Loss</option>
        </select>
        
        <label htmlFor='diffFilter'>Difficulty Filter:</label>
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
        
        <label htmlFor='sort'>Sorting:</label>
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
    </form>;
};

export default GameSearch;