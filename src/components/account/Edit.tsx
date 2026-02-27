import { useReducer, type RefObject } from 'react';

import Modal from '../generic/Modal';
import { editAccount } from '../../utils/gateway';
import { type AccountResponse, type AccountMessageTypes, AccountMessages } from '../../utils/types';
import { selectAuthToken } from '../../store/sessionSlice';
import { useAppSelector } from '../../utils/hooks';

import styles from './AccountStyles.module.scss';

type Props = {
    modalRef: RefObject<HTMLDialogElement | null>,
};

type reducerAction = {
    type: 'init' | 'password' | 'confirm' | 'server',
    payload?: string | number[]
}

const initState: AccountResponse = {
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

const checkCanSubmit = (passError: AccountMessageTypes | null, confirmError: AccountMessageTypes | null) => passError === null && confirmError === null;

const reducer = (state: AccountResponse, action: reducerAction): AccountResponse => {
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
        case 'password': {
            if(typeof action.payload === 'string'){
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
                    canSubmit: checkCanSubmit(error, state.confirmObj.error)
                };
            }
            break;
        }
        case 'confirm': {
            if(typeof action.payload === 'string'){
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
                    canSubmit: checkCanSubmit(state.passwordObj.error, error)
                };
            }
            break;
        }
        case 'server': {
            let pwordError = null;
            let confirmError = null;
            
            if(Array.isArray(action.payload)){
                action.payload.forEach((error) => {
                    switch(error){
                        case 1:
                            pwordError = AccountMessages.PWORDLENGTH;
                            break;
                        case 2:
                            pwordError = AccountMessages.PWORDOLD;
                            break;
                        case 3:
                            confirmError = AccountMessages.PWORDNOMATCH;
                            break;
                        default:
                            break;
                    }
                });
            
                return {
                    ...state,
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
            break;
        }
    }

    return state;
};

export default function Edit({modalRef}: Props) {
    const [formState, localDispatch] = useReducer(reducer, initState);

    const authToken = useAppSelector(selectAuthToken);

    const handlePassword = (event: React.ChangeEvent<HTMLInputElement>) => {
        localDispatch({type: 'password', payload: event.target.value});
    };

    const handleConfirm = (event: React.ChangeEvent<HTMLInputElement>) => {
        localDispatch({type: 'confirm', payload: event.target.value});
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if(authToken){
            const accountResponse = await editAccount(authToken, formState.passwordObj.value, formState.confirmObj.value);
            const errors: number[] = await accountResponse.json();

            switch(accountResponse.status){
                case 200: {
                    localDispatch({type: 'init'});
                    modalRef.current?.close();
                    break;
                }
                case 400: {
                    localDispatch({type: 'server', payload: errors});
                    break;
                }
                default: {
                    localDispatch({type: 'init', payload: AccountMessages.SERVERERROR});
                    break;
                }
            }
        }
    };

    const handleClose = () => {
        localDispatch({type: 'init'});
    }
    
    return <Modal modalRef={modalRef} onClose={handleClose} title='Edit Account'>
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
                <p className={`${styles.infoLabel} ${styles.label}`}>Password cannot contain spaces</p>
                {formState.passwordObj.error !== null && <p className={styles.errorLabel}>{formState.passwordObj.error}</p>}
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
                {formState.confirmObj.error !== null && <p className={styles.errorLabel}>{formState.confirmObj.error}</p>}
            </div>

            {formState.mainError !== null && <p className={styles.errorLabel}>{formState.mainError}</p>}
            
            <button type='submit' disabled={!formState.canSubmit} className={styles.formButton}>Update</button>
        </form>
    </Modal>;
}