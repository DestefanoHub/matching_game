import styles from './Banner.module.css';

const Banner = (props) => {
    return <div className={styles.banner}>
        <span className={styles.text}>{props.text}</span>
    </div>;
};

export default Banner;