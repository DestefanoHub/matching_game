import type { ReactNode } from 'react';
import styles from './Modal.module.css';

type Props = {
    modalRef: any,
    onClose?: Function,
    children: ReactNode
}

export default function Modal({ modalRef, onClose, children }: Props) {
    return <dialog ref={modalRef} className={styles.modal} onClose={onClose}>
        {children}
    </dialog>;
}