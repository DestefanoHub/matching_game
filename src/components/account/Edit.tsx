import { useReducer, type RefObject } from 'react';

import Modal from '../generic/Modal';
import Banner from '../generic/Banner';
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
        errors: [],
    },
    confirmObj: {
        value: '',
        errors: [],
    },
    mainError: null,
    canSubmit: false
}

const checkCanSubmit = (passError: AccountMessageTypes[], confirmError: AccountMessageTypes[]) => !(passError.length && confirmError.length);

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
                let errors: AccountMessageTypes[] = [];
                
                if(password.length < 12) {
                    errors.push(AccountMessages.PWORDLENGTH);
                }else if(password.length > 30) {
                    errors.push(AccountMessages.PWORDLENGTH);
                }

                return {
                    ...state,
                    passwordObj: {
                        value: password,
                        errors
                    },
                    canSubmit: checkCanSubmit(errors, state.confirmObj.errors)
                };
            }
            break;
        }
        case 'confirm': {
            if(typeof action.payload === 'string'){
                const confirm = action.payload.trim();
                let errors: AccountMessageTypes[] = [];

                if(state.passwordObj.value !== confirm){
                    errors.push(AccountMessages.PWORDNOMATCH);
                }

                return {
                    ...state,
                    confirmObj: {
                        value: confirm,
                        errors
                    },
                    canSubmit: checkCanSubmit(state.passwordObj.errors, errors)
                };
            }
            break;
        }
        case 'server': {
            const pwordErrors: AccountMessageTypes[] = [];
            const confirmErrors: AccountMessageTypes[] = [];
            
            if(Array.isArray(action.payload)){
                action.payload.forEach((error) => {
                    switch(error){
                        case 1:
                            pwordErrors.push(AccountMessages.PWORDLENGTH);
                            break;
                        case 2:
                            pwordErrors.push(AccountMessages.PWORDOLD);
                            break;
                        case 3:
                            confirmErrors.push(AccountMessages.PWORDNOMATCH);
                            break;
                        default:
                            break;
                    }
                });
            
                return {
                    ...state,
                    passwordObj: {
                        ...state.passwordObj,
                        errors: pwordErrors
                    },
                    confirmObj: {
                        ...state.confirmObj,
                        errors: confirmErrors
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

    const getPasswordErrors = formState.passwordObj.errors.map((error) => {
        return <Banner text={error} style='error'/>;
    });

    const getConfirmErrors = formState.confirmObj.errors.map((error) => {
        return <Banner text={error} style='error'/>;
    });
    
    return <Modal modalRef={modalRef} onClose={handleClose} title='Edit Account'>
        <form onSubmit={handleSubmit} className={styles.form}>            
            <div className={styles.formRow}>
                <div className={`${styles.inputSection} ${formState.passwordObj.errors.length && styles.error}`}>
                    <label className={styles.label} htmlFor='editPassword'>New Password:</label>
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
                        className={styles.input}
                    />
                </div>
                <Banner text='Password cannot contain spaces' style='info'/>
                {formState.passwordObj.errors.length > 0 && getPasswordErrors}
            </div>

            <div className={styles.formRow}>
                <div className={`${styles.inputSection} ${formState.confirmObj.errors.length && styles.error}`}>
                    <label className={styles.label} htmlFor='editConfirm'>Confirm New Password:</label>
                    <input 
                        type='password'
                        id='editConfirm'
                        value={formState.confirmObj.value}
                        onChange={handleConfirm}
                        spellCheck='false'
                        required={true}
                        minLength={12}
                        maxLength={30}
                        className={styles.input}
                    />
                </div>
                {formState.confirmObj.errors.length > 0 && getConfirmErrors}
            </div>

            {formState.mainError !== null && <div className={styles.formRow}><Banner text={formState.mainError} style='error'/></div>}
            
            <button type='submit' disabled={!formState.canSubmit} className={styles.formButton}>Update</button>
        </form>
    </Modal>;
}