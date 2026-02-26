import { useReducer, type RefObject } from 'react';

import Modal from '../generic/Modal';
import { createAccount } from '../../utils/gateway';
import { loginThunk } from '../../store/sessionSlice';
import { type AccountResponse, type AccountMessageTypes, AccountMessages, type Player } from '../../utils/types';
import { useAppDispatch } from '../../utils/hooks';

import styles from './AccountStyles.module.scss';

type Props = {
    modalRef: RefObject<HTMLDialogElement | null>
};

type reducerAction = {
    type: 'init' | 'username' | 'password' | 'confirm' | 'server',
    payload?: string | number[]
}

const initState = {
    usernameObj: {
        value: '',
        error: null,
    },
    passwordObj: {
        value: '',
        error: null,
    },
    confirmObj: {
        value: '',
        error: null,
    },
    mainError: null,
    canSubmit: false
}

const checkCanSubmit = (nameError: AccountMessageTypes | null, passError: AccountMessageTypes | null, confirmError: AccountMessageTypes | null) => nameError === null && passError === null && confirmError === null;

const reducer = (state: AccountResponse, action: reducerAction) => {
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
                canSubmit: checkCanSubmit(error, state.passwordObj.error, state.confirmObj.error)
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
                canSubmit: checkCanSubmit(state.usernameObj!.error, error, state.confirmObj.error)
            };
        }
        case 'confirm': {
            const confirm = action.payload.trim();
            let error: AccountMessageTypes | null = null;

            if(state.passwordObj.value !== confirm){
                error = AccountMessages.PWORDNOMATCH;
            }

            return {
                ...state,
                confirmObj: {
                    value: confirm,
                    error
                },
                canSubmit: checkCanSubmit(state.usernameObj!.error, state.passwordObj.error, error)
            };
        }
        case 'server': {
            let unameError = null;
            let pwordError = null;
            let confirmError = null;
            
            action.payload.forEach((error) => {
                switch(error){
                    case 1:
                        unameError = AccountMessages.UNAMELENGTH;
                        break;
                    case 2:
                        unameError = AccountMessages.UNAMETAKEN;
                        break;
                    case 3:
                        pwordError = AccountMessages.PWORDLENGTH;
                        break;
                    case 4:
                        confirmError = AccountMessages.PWORDNOMATCH;
                        break;
                    default:
                        break;
                }
            });
            
            return {
                ...state,
                usernameObj: {
                    ...state.usernameObj,
                    error: unameError
                },
                passwordObj: {
                    ...state.passwordObj,
                    error: pwordError
                },
                confirmObj: {
                    ...state.confirmObj,
                    error: confirmError
                }
            }
        }
    }
};

export default function Create({modalRef}: Props) {
    const [formState, localDispatch] = useReducer(reducer, initState);

    const dispatch = useAppDispatch();

    const handleUsername = (event: React.ChangeEvent<HTMLInputElement>) => {
        localDispatch({type: 'username', payload: event.target.value});
    };

    const handlePassword = (event: React.ChangeEvent<HTMLInputElement>) => {
        localDispatch({type: 'password', payload: event.target.value});
    };

    const handleConfirm = (event: React.ChangeEvent<HTMLInputElement>) => {
        localDispatch({type: 'confirm', payload: event.target.value});
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const accountResponse = await createAccount(formState.usernameObj!.value, formState.passwordObj.value, formState.confirmObj.value);

        switch(accountResponse.status){
            case 201: {
                const [, account]: [undefined, Player] = await accountResponse.json();
                dispatch(loginThunk(account));
                modalRef.current?.close();
                break;
            }
            case 400: {
                const [errors]: [number[]] = await accountResponse.json();
                localDispatch({type: 'server', payload: errors});
            }
            default: {
                localDispatch({type: 'init', payload: AccountMessages.SERVERERROR});
                break;
            }
        }
    };

    const handleClose = () => {
        localDispatch({type: 'init'});
    }
    
    return <Modal modalRef={modalRef} onClose={handleClose} title='Create Account'>
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
                {/* {formState.usernameObj!.error !== null && <p id='usernameHelp' className={styles.errorLabel}>Username must be between 5 and 30 characters</p>} */}
                {formState.usernameObj!.error !== null && <p className={styles.errorLabel}>{formState.usernameObj!.error}</p>}
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
                {/* {formState.passwordObj.error !== null && <p id='passwordHelp' className={styles.errorLabel}>Password must be between 12 and 30 characters</p>} */}
                {formState.passwordObj.error !== null && <p className={styles.errorLabel}>{formState.passwordObj.error}</p>}
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
                {formState.confirmObj.error !== null && <p className={styles.errorLabel}>{formState.confirmObj.error}</p>}
            </div>

            {formState.mainError !== null && <p className={styles.errorLabel}>{formState.mainError}</p>}
            
            <button type='submit' disabled={!formState.canSubmit} className={styles.formButton}>Create</button>
        </form>
    </Modal>;
}