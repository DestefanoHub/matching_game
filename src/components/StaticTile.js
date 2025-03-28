import staticStyles from './StaticTile.module.css';
import tileStyles from './Tile.module.css';

const StaticTile = (props) => {
    return <button 
        type='button'
        style={{animationDelay: `${props.interval}s`}}
        className={`${tileStyles.tile} ${staticStyles.animate}`}
    >
    </button>
};

export default StaticTile;