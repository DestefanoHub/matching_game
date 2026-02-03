import staticStyles from './StaticTile.module.scss';
import tileStyles from '../game/Tile.module.scss';

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