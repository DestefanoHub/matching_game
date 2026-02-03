import styles from './StaticTile.module.scss';

type Props = {
    interval: number
};

export default function StaticTile({ interval }: Props) {
    return <button 
        type='button'
        style={{animationDelay: `${interval}s`}}
        className={`${styles.tile} ${styles.animate}`}
    >
    </button>
}