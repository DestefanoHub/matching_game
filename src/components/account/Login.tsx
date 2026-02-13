import { useState, type RefObject } from 'react';

import Modal from '../generic/Modal';
import { login as loginRequest } from '../../utils/gateway';
import { loginThunk } from '../../store/sessionSlice';
import type { Player, LoginResponse } from '../../utils/types';
import { useAppDispatch } from '../../utils/hooks';

import styles from './FormStyles.module.scss';

type Props = {
    modalRef: RefObject<HTMLDialogElement | null>
};

const initState: LoginResponse = {
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
    mainError: false
};

export default function Login({modalRef}: Props) {
    const [formState, setFormState] = useState<LoginResponse>(initState);
    
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

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const loginResponse = await loginRequest(formState.usernameObj.value, formState.passwordObj.value);

        if(loginResponse.status === 201){
            const player: Player = await loginResponse.json();
            dispatch(loginThunk(player));
            modalRef.current?.close();
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
    
    return <Modal modalRef={modalRef} onClose={handleClose} title='Login'>
        <form onSubmit={handleSubmit} className={styles.form}>
            <div>
                <div className={`${styles.inputSection} ${formState.usernameObj.error && styles.error}`}>
                    <label htmlFor='loginUsername'>Username:</label>
                    <input
                        type='text'
                        id='loginUsername'
                        value={formState.usernameObj.value}
                        onChange={handleUsername}
                        spellCheck='false'
                        required={true}
                        minLength={5}
                        maxLength={30}
                        aria-describedby='usernameHelp'
                        autoComplete='off'
                    />
                </div>
                {formState.usernameObj.error && <p id='usernameHelp' className={styles.errorLabel}>Username must be between 5 and 30 characters</p>}
                {formState.usernameObj.error && <p className={styles.errorLabel}>{formState.usernameObj.message}</p>}
            </div>
            
            <div>
                <div className={`${styles.inputSection} ${formState.passwordObj.error && styles.error}`}>
                    <label htmlFor='loginPassword'>Password:</label>
                    <input 
                        type='password'
                        id='loginPassword'
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

            {formState.mainError && <p className={styles.errorLabel}>Invalid credentials.</p>}
            
            <button type='submit'>Login</button>
        </form>
    </Modal>;
}