import type { ReactNode, RefObject } from 'react';

import styles from './Modal.module.scss';

type Props = {
    modalRef: RefObject<HTMLDialogElement | null>,
    onClose?: () => void,
    title: string
    children: ReactNode
};

export default function Modal({ modalRef, onClose, title, children }: Props) {
    const handleClose = () => {
        modalRef.current?.close();
    };
    
    return <dialog ref={modalRef} className={styles.modal} onClose={onClose}>
        <div className={styles.header}>
            <h1>{title}</h1>
            <button className={styles.close} onClick={handleClose}>X</button>
        </div>
        {children}
    </dialog>;
}