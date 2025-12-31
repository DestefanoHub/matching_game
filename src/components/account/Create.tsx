import { useState, type RefObject } from 'react';

import Modal from '../generic/Modal';
import { createAccount } from '../../utils/gateway';
import { login } from '../../store/sessionSlice';
import type { AccountResponse } from '../../utils/types';
import { useAppDispatch } from '../../utils/hooks';

import styles from './FormStyles.module.css';

type Props = {
    modalRef: RefObject<HTMLDialogElement | null>
};

const initState = {
    usernameObj: {
        value: '',
        error: false,
        message: ''
    },
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

export default function Create({modalRef}: Props) {
    const [formState, setFormState] = useState<AccountResponse>(initState);

    const dispatch = useAppDispatch();

    const handleUsername = (event: React.ChangeEvent<HTMLInputElement>) => {
        const username = event.target.value.trim();
        let error = false;
        let message = '';

        if(username.length < 5) {
            error = true;
            message = 'Username too short.';
        }else if(username.length > 30) {
            error = true;
            message = 'Username too long.';
        }

        setFormState(prevState => ({
            ...prevState,
            usernameObj: {
                value: username,
                error,
                message
            }
        }));
    };

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

        const [accountResponse, account]= await createAccount(formState.usernameObj!.value, formState.passwordObj.value, formState.confirmObj.value);

        if(accountResponse.usernameObj!.error || accountResponse.passwordObj.error || accountResponse.confirmObj.error || accountResponse.mainError){
            setFormState(accountResponse);
                        
            if(account !== null){
                dispatch(login(account));
                modalRef.current?.close();
            }
        }else{
            setFormState({
                ...initState,
                mainError: true
            });
        }
    };

    const handleClose = () => {
        setFormState(initState);
    }
    
    return <Modal modalRef={modalRef} onClose={handleClose}>
        <h1>Create Account</h1>
        <form onSubmit={handleSubmit} className={styles.form}>
            <div>
                <div className={`${styles.inputSection} ${formState.usernameObj!.error && styles.error}`}>
                    <label htmlFor='createUsername'>Username:</label>
                    <input
                        type='text'
                        id='createUsername'
                        value={formState.usernameObj!.value}
                        onChange={handleUsername}
                        spellCheck='false'
                        required={true}
                        minLength={5}
                        maxLength={30}
                        aria-describedby='usernameHelp'
                        autoComplete='off'
                    />
                </div>
                {formState.usernameObj!.error && <p id='usernameHelp' className={styles.errorLabel}>Username must be between 5 and 30 characters</p>}
                {formState.usernameObj!.error && <p className={styles.errorLabel}>{formState.usernameObj!.message}</p>}
            </div>
            
            <div>
                <div className={`${styles.inputSection} ${formState.passwordObj.error && styles.error}`}>
                    <label htmlFor='createPassword'>Password:</label>
                    <input 
                        type='password'
                        id='createPassword'
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
                    <label htmlFor='createConfirm'>Confirm Password:</label>
                    <input 
                        type='password'
                        id='createConfirm'
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

            {formState.mainError && <p className={styles.errorLabel}>An error has occurred attempting to create your account.</p>}
            
            <button type='submit'>Create</button>
        </form>
    </Modal>;
}