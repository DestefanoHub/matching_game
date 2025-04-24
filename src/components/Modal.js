import styles from './Modal.module.css';

const Modal = ({ modalRef, onClose, children }) => {
    return <dialog ref={modalRef} className={styles.modal} onClose={onClose}>
        {children}
    </dialog>;
};

export default Modal;