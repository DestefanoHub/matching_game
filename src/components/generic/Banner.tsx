import type { BannerClass } from '../../utils/types';

import styles from './Banner.module.scss';

type Props = {
    text: string
    style?: BannerClass
};

export default function Banner({ text, style='info' }: Props) {    
    return <div className={styles[style]}>
        <span className={styles.text}>{text}</span>
    </div>;
}