import staticStyles from './StaticTile.module.css';
import tileStyles from './Tile.module.css';

const StaticTile = ({ interval }) => {
    return <button 
        type='button'
        style={{animationDelay: `${interval}s`}}
        className={`${tileStyles.tile} ${staticStyles.animate}`}
    >
    </button>
};

export default StaticTile;