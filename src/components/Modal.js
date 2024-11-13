import styles from './Modal.module.css';

const Modal = (props) => {
    return <dialog ref={props.modalRef} className={styles.modal} onClose={props.onClose}>
        {props.children}
    </dialog>;
};

export default Modal;