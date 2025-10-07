import { useState, type Ref } from 'react';

import Modal from '../generic/Modal';

import styles from './FormStyles.module.css';

type Props = {
    modalRef: Ref<HTMLDialogElement>
};

export default function Create({modalRef}: Props) {
    const [formState, setFormState] = useState({
        username: {
            value: '',
            error: false,
            message: ''
        },
        password: {
            value: '',
            error: false,
            message: ''
        },
        confirm: {
            value: '',
            error: false,
            message: ''
        }
    });

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

        //check username doesn't exist already

        setFormState(prevState => ({
            ...prevState,
            username: {
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
            password: {
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
            if(prevState.password.value !== confirm) {
                error = true;
                message = 'Password does not match.';
            }
            
            return {
                ...prevState,
                confirm: {
                    value: confirm,
                    error,
                    message
                }
            }
        });
    };

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
    };
    
    return <Modal modalRef={modalRef}>
        <h1>Create Account</h1>
        <form onSubmit={handleSubmit} className={styles.form}>
            <div>
                <div className={styles.inputSection}>
                    <label htmlFor='username'>Username:</label>
                    <input
                        className={`${formState.username.error && styles.error}`}
                        type='text'
                        id='username'
                        value={formState.username.value}
                        onChange={handleUsername}
                        spellCheck='false'
                        required={true}
                        minLength={5}
                        maxLength={30}
                        aria-describedby='usernameHelp'
                        autoComplete='off'
                    />
                </div>
                <p id='usernameHelp'>Username must be between 5 and 30 characters</p>
                {formState.username.error && <p>{formState.username.message}</p>}
            </div>
            
            <div>
                <div className={styles.inputSection}>
                    <label htmlFor='password'>Password:</label>
                    <input 
                        className={`${formState.password.error && styles.error}`}
                        type='password'
                        id='password'
                        value={formState.password.value}
                        onChange={handlePassword}
                        spellCheck='false'
                        required={true}
                        minLength={12}
                        maxLength={30}
                        aria-describedby='passwordHelp'
                    />
                </div>
                <p id='passwordHelp'>Password must be between 12 and 30 characters</p>
                {formState.password.error && <p>{formState.password.message}</p>}
            </div>

            <div>
                <div className={styles.inputSection}>
                    <label htmlFor='confirm'>Confirm Password:</label>
                    <input 
                        className={`${formState.confirm.error && styles.error}`}
                        type='password'
                        id='confirm'
                        value={formState.confirm.value}
                        onChange={handleConfirm}
                        spellCheck='false'
                        required={true}
                        minLength={12}
                        maxLength={30}
                    />
                </div>
                {formState.confirm.error && <p>{formState.confirm.message}</p>}
            </div>
            
            <button type='submit'>Create</button>
        </form>
    </Modal>;
}