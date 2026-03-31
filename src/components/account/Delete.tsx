import { useState, type RefObject} from 'react';

import Banner from '../generic/Banner';
import { selectAuthToken, logout } from '../../store/sessionSlice';
import { deleteAccount } from '../../utils/gateway';
import { useAppSelector, useAppDispatch } from '../../utils/hooks';
import { AccountMessages } from '../../utils/types';

import styles from './Delete.module.scss';
import genericStyles from './AccountStyles.module.scss';

type Props = {
    changeEditMode: (arg0: boolean) => void,
    modalRef: RefObject<HTMLDialogElement | null>
};

export default function Delete({changeEditMode, modalRef}: Props) {
    const [state, setState] = useState(false);
    const authToken = useAppSelector(selectAuthToken);
    
    const dispatch = useAppDispatch();
    
    const handleKeep = () => {
        changeEditMode(true);
    };

    const handleDelete = async () => {
        if(authToken){
            const deleteResponse = await deleteAccount(authToken);

            switch(deleteResponse.status){
                case 204:
                    dispatch(logout());
                    modalRef.current?.close();
                    break;
                case 404:
                default: 
                    setState(true);
                    break;
            }
        }
    };
    
    return <div className={styles.display}>
        <p>
            If you delete your account, it cannot be recovered and you will no longer be able to access your account.
            You will also be logged out. Any games you have played will be kept and your username will continue to be 
            associated with them.
        </p>
        <h2>Are you sure you want to delete your account?</h2>
        {state && <Banner text={AccountMessages.SERVERERROR} style='error'/>}
        <button type='button' className={genericStyles.formButton} onClick={handleKeep}>No, Keep My Account</button>
        <button type='button' className={`${genericStyles.formButton} ${genericStyles.deleteButton}`} onClick={handleDelete}>Yes, Delete My Account</button>
    </div>;
}