import { useState, type Ref } from 'react';

import Modal from '../generic/Modal';
import { editAccount } from '../../utils/gateway';
import type { AccountResponse } from '../../utils/types';
import { selectAuthToken } from '../../store/sessionSlice';
import { useAppSelector } from '../../utils/hooks';

import styles from './FormStyles.module.scss';

type Props = {
    modalRef: Ref<HTMLDialogElement | null>,
};

const initState = {
    passwordObj: {
        value: '',
        error: false,
        message: ''
    },
    confirmObj: {
        value: '',
        error: false,
        message: ''
    },
    mainError: false
}

export default function Edit({modalRef}: Props) {
    const [formState, setFormState] = useState<AccountResponse>(initState);

    const authToken = useAppSelector(selectAuthToken);

    const handlePassword = (event: React.ChangeEvent<HTMLInputElement>) => {
        const password = event.target.value.trim();
        let error = false
        let message = '';

        if(password.length < 12) {
            error = true;
            message = 'Password too short.';
        }else if(password.length > 30) {
            error = true;
            message = 'Password too long.';
        }

        setFormState(prevState => ({
            ...prevState,
            passwordObj: {
                value: password,
                error,
                message
            }
        }));
    };

    const handleConfirm = (event: React.ChangeEvent<HTMLInputElement>) => {
        const confirm = event.target.value.trim();
        let error = false;
        let message = '';

        setFormState(prevState => {
            if(prevState.passwordObj.value !== confirm) {
                error = true;
                message = 'Password does not match.';
            }
            
            return {
                ...prevState,
                confirmObj: {
                    value: confirm,
                    error,
                    message
                }
            }
        });
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if(authToken){
            const accountResponse = await editAccount(authToken, formState.passwordObj.value, formState.confirmObj.value);

            if(accountResponse.passwordObj.error || accountResponse.confirmObj.error || accountResponse.mainError){
                setFormState(accountResponse);
            }else{
                setFormState(initState);
            }
        }
    };

    const handleClose = () => {
        setFormState(initState);
    }
    
    return <Modal modalRef={modalRef} onClose={handleClose}>
        <h1>Edit Account</h1>
        <form onSubmit={handleSubmit} className={styles.form}>            
            <div>
                <div className={`${styles.inputSection} ${formState.passwordObj.error && styles.error}`}>
                    <label htmlFor='editPassword'>New Password:</label>
                    <input 
                        type='password'
                        id='editPassword'
                        value={formState.passwordObj.value}
                        onChange={handlePassword}
                        spellCheck='false'
                        required={true}
                        minLength={12}
                        maxLength={30}
                        aria-describedby='passwordHelp'
                    />
                </div>
                {formState.passwordObj.error && <p id='passwordHelp' className={styles.errorLabel}>Password must be between 12 and 30 characters</p>}
                {formState.passwordObj.error && <p className={styles.errorLabel}>{formState.passwordObj.message}</p>}
            </div>

            <div>
                <div className={`${styles.inputSection} ${formState.confirmObj.error && styles.error}`}>
                    <label htmlFor='editConfirm'>Confirm New Password:</label>
                    <input 
                        type='password'
                        id='editConfirm'
                        value={formState.confirmObj.value}
                        onChange={handleConfirm}
                        spellCheck='false'
                        required={true}
                        minLength={12}
                        maxLength={30}
                    />
                </div>
                {formState.confirmObj.error && <p className={styles.errorLabel}>{formState.confirmObj.message}</p>}
            </div>

            {formState.mainError && <p className={styles.errorLabel}>An error has occurred attempting to edit your account.</p>}
            
            <button type='submit'>Update</button>
        </form>
    </Modal>;
}