import styles from './Banner.module.scss';

type Props = {
    text: string
};

export default function Banner({ text }: Props) {
    return <div className={styles.banner}>
        <span className={styles.text}>{text}</span>
    </div>;
}