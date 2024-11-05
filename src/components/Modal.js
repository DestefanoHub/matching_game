import styles from './Modal.module.css';

const Modal = (props) => {
    return <dialog ref={props.modalRef} className={styles.modal}>
        {props.children}
    </dialog>;
};

export default Modal;