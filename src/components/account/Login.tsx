import { useReducer, type RefObject } from 'react';

import Modal from '../generic/Modal';
import Banner from '../generic/Banner';
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
        error: boolean,
        touched: boolean
    },
    passwordObj: {
        value: string,
        error: boolean,
        touched: boolean
    },
    mainError: AccountMessageTypes | null,
    canSubmit: boolean,
};

const initState: LoginResponse = {
    usernameObj: {
        value: '',
        error: true,
        touched: false
    },
    passwordObj: {
        value: '',
        error: true,
        touched: false
    },
    mainError: null,
    canSubmit: false
};

const checkCanSubmit = (nameError: boolean, passError: boolean) => !(nameError || passError);

const reducer = (state: LoginResponse, action: reducerAction): LoginResponse => {
    /*
    * If there is no payload, just return the state as-is, unless the action is 'init'.
    * This short-circuts the processing of the switch statement since payload is almost always required.
    */
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
            let error = true;

            if(username.length >= 5 && username.length <= 30) {
                error = false;
            }

            return {
                ...state,
                usernameObj: {
                    value: username,
                    error,
                    touched: true
                },
                canSubmit: checkCanSubmit(error, state.passwordObj.error)
            };
        }
        case 'password': {
            const password = action.payload.trim();
            let error = true;
            
            if(password.length >= 12 && password.length <= 30) {
                error = false;
            }

            return {
                ...state,
                passwordObj: {
                    value: password,
                    error,
                    touched: true
                },
                canSubmit: checkCanSubmit(state.usernameObj.error, error)
            };
        }
        default:
            return state;
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

        switch(loginResponse.status){
            case 201: {
                const player: Player = await loginResponse.json();
                dispatch(loginThunk(player));
                modalRef.current?.close();
                break;
            }
            case 401: 
                localDispatch({type: 'init', payload: AccountMessages.INVALID});
                break;
            default:
                localDispatch({type: 'init', payload: AccountMessages.SERVERERROR});
                break;
        }
    };

    const handleClose = () => {
        localDispatch({type: 'init'});
    }
    
    return <Modal modalRef={modalRef} onClose={handleClose} title='Login'>
        <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.formRow}>
                <div className={`${styles.inputSection} ${(formState.usernameObj.error && formState.usernameObj.touched) && styles.error}`}>
                    <label className={styles.label} htmlFor='loginUsername'>Username:</label>
                    <input
                        type='text'
                        id='loginUsername'
                        value={formState.usernameObj.value}
                        onChange={handleUsername}
                        spellCheck='false'
                        required={true}
                        minLength={5}
                        maxLength={30}
                        autoComplete='off'
                        className={styles.input}
                    />
                </div>
            </div>
            
            <div className={styles.formRow}>
                <div className={`${styles.inputSection} ${(formState.passwordObj.error && formState.passwordObj.touched) && styles.error}`}>
                    <label className={styles.label} htmlFor='loginPassword'>Password:</label>
                    <input 
                        type='password'
                        id='loginPassword'
                        value={formState.passwordObj.value}
                        onChange={handlePassword}
                        spellCheck='false'
                        required={true}
                        minLength={12}
                        maxLength={30}
                        className={styles.input}
                    />
                </div>
            </div>

            {formState.mainError !== null && <div className={styles.formRow}><Banner text={formState.mainError} style='error'/></div>}
           
            <button type='submit' disabled={!formState.canSubmit} className={styles.formButton}>Login</button>
        </form>
    </Modal>;
}