import staticStyles from './StaticTile.module.css';
import tileStyles from '../game/Tile.module.css';

type Props = {
    interval: number
};

export default function StaticTile({ interval }: Props) {
    return <button 
        type='button'
        style={{animationDelay: `${interval}s`}}
        className={`${tileStyles.tile} ${staticStyles.animate}`}
    >
    </button>
}