import styles from './Banner.module.css';

const Banner = ({ text }) => {
    return <div className={styles.banner}>
        <span className={styles.text}>{text}</span>
    </div>;
};

export default Banner;