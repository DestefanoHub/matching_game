import { useReducer, type RefObject } from 'react';

import Modal from '../generic/Modal';
import { login as loginRequest } from '../../utils/gateway';
import { loginThunk } from '../../store/sessionSlice';
import { type Player, type AccountMessageTypes, AccountMessages } from '../../utils/types';
import { useAppDispatch } from '../../utils/hooks';

import styles from './AccountStyles.module.scss';

type Props = {
    modalRef: RefObject<HTMLDialogElement | null>
};

type reducerAction = {
    type: 'init' | 'username' | 'password',
    payload?: string
}

type LoginResponse = {
    usernameObj: {
        value: string,
        error: AccountMessageTypes | null
    },
    passwordObj: {
        value: string,
        error: AccountMessageTypes | null
    },
    mainError: AccountMessageTypes | null,
    canSubmit: boolean,
};

const initState: LoginResponse = {
    usernameObj: {
        value: '',
        error: null,
    },
    passwordObj: {
        value: '',
        error: null,
    },
    mainError: null,
    canSubmit: false
};

const checkCanSubmit = (nameError: AccountMessageTypes | null, passError: AccountMessageTypes | null) => nameError === null && passError === null;

const reducer = (state: LoginResponse, action: reducerAction) => {
    if(typeof action.payload === 'undefined'){
        if(action.type === 'init'){
            return initState;
        }
        
        return state;
    }
    
    switch(action.type){
        case 'init': {
            return {
                ...initState,
                mainError: action.payload as AccountMessageTypes
            };
        }
        case 'username': {
            const username = action.payload.trim();
            let error: AccountMessageTypes | null = null;

            if(username.length < 5) {
                error = AccountMessages.UNAMELENGTH;
            }else if(username.length > 30) {
                error = AccountMessages.UNAMELENGTH;
            }

            return {
                ...state,
                usernameObj: {
                    value: username,
                    error
                },
                canSubmit: checkCanSubmit(error, state.passwordObj.error)
            };
        }
        case 'password': {
            const password = action.payload.trim();
            let error: AccountMessageTypes | null = null;
            
            if(password.length < 12) {
                error = AccountMessages.PWORDLENGTH;
            }else if(password.length > 30) {
                error = AccountMessages.PWORDLENGTH;
            }

            return {
                ...state,
                passwordObj: {
                    value: password,
                    error
                },
                canSubmit: checkCanSubmit(state.usernameObj.error, error)
            };
        }
    }
};

export default function Login({modalRef}: Props) {
    const [formState, localDispatch] = useReducer(reducer, initState);
    
    const dispatch = useAppDispatch();

    const handleUsername = (event: React.ChangeEvent<HTMLInputElement>) => {        
        localDispatch({type: 'username', payload: event.target.value});
    };

    const handlePassword = (event: React.ChangeEvent<HTMLInputElement>) => {
        localDispatch({type: 'password', payload: event.target.value})
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const loginResponse = await loginRequest(formState.usernameObj.value, formState.passwordObj.value);

        if(loginResponse.status === 201){
            const player: Player = await loginResponse.json();
            dispatch(loginThunk(player));
            modalRef.current?.close();
        }else{
            localDispatch({type: 'init', payload: AccountMessages.INVALID});
        }
    };

    const handleClose = () => {
        localDispatch({type: 'init'});
    }
    
    return <Modal modalRef={modalRef} onClose={handleClose} title='Login'>
        <form onSubmit={handleSubmit} className={styles.form}>
            <div>
                <div className={`${styles.inputSection} ${formState.usernameObj.error !== null && styles.error}`}>
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
            </div>
            
            <div>
                <div className={`${styles.inputSection} ${formState.passwordObj.error !== null && styles.error}`}>
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
            </div>

            {formState.mainError !== null && <p className={styles.errorLabel}>{formState.mainError}</p>}
            
            <button type='submit' disabled={!formState.canSubmit} className={styles.formButton}>Login</button>
        </form>
    </Modal>;
}