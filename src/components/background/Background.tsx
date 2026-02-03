import StaticTile from './StaticTile';

import styles from './Background.module.scss';

export default function Background() {
    const tiles = [];

    for(let i = 0; i < 18; i++){
        const tile = {
            id: i,
            interval: Math.floor(Math.random() * 11) + 4
        };
        tiles.push(tile);
    }

    const tileGrid = tiles.map((tile) => <StaticTile key={tile.id} interval={tile.interval}/>);
    
    return <div className={styles.grid}>
        {tileGrid}
    </div>;
}