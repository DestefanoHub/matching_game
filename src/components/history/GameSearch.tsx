import { useState, useRef } from 'react';
import { useAppSelector, useAppDispatch } from '../../utils/hooks';

import { selectWLFilter, selectDiffFilter, selectSort, searchThunk, wlFilterThunk, diffFilterThunk, sortThunk } from '../../store/historySlice';

import styles from './GameSearch.module.css';

export default function GameSearch() {
    const searchDelayTimeout = useRef(null);
    const [ searchValLocal, setSearchValLocal ] = useState('');
    const wlFilterVal = useAppSelector(selectWLFilter);
    const diffFilterVal = useAppSelector(selectDiffFilter);
    const sortVal = useAppSelector(selectSort);

    const dispatch = useAppDispatch();

    const handleChangeSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchValLocal(event.target.value);

        clearTimeout(searchDelayTimeout.current);

        searchDelayTimeout.current = setTimeout(() => {
            dispatch(searchThunk(event.target.value));
        }, 750);
    };

    const handleChangeWLFilter = (event: React.ChangeEvent<HTMLSelectElement>) => {
        dispatch(wlFilterThunk(event.target.value));
    };

    const handleChangeDiffFilter = (event: React.ChangeEvent<HTMLSelectElement>) => {
        dispatch(diffFilterThunk(+event.target.value));
    };

    const handleChangeSort = (event: React.ChangeEvent<HTMLSelectElement>) => {
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
}