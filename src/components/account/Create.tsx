import { useReducer, type RefObject } from 'react';

import Modal from '../generic/Modal';
import Banner from '../generic/Banner';
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

const initState: AccountResponse = {
    usernameObj: {
        value: '',
        errors: [],
    },
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

const checkCanSubmit = (nameErrors: AccountMessageTypes[], passErrors: AccountMessageTypes[], confirmErrors: AccountMessageTypes[]) => !(nameErrors.length && passErrors.length && confirmErrors.length);

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
        case 'username': {
            if(typeof action.payload === 'string'){
                const username = action.payload.trim();
                let errors: AccountMessageTypes[] = [];

                if(username.length < 5) {
                    errors.push(AccountMessages.UNAMELENGTH);
                }else if(username.length > 30) {
                    errors.push(AccountMessages.UNAMELENGTH);
                }

                return {
                    ...state,
                    usernameObj: {
                        value: username,
                        errors
                    },
                    canSubmit: checkCanSubmit(errors, state.passwordObj.errors, state.confirmObj.errors)
                };
            }
            break;
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
                    canSubmit: checkCanSubmit(state.usernameObj!.errors, errors, state.confirmObj.errors)
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
                    canSubmit: checkCanSubmit(state.usernameObj!.errors, state.passwordObj.errors, errors)
                };
            }
            break;
        }
        case 'server': {
            const unameErrors: AccountMessageTypes[] = [];
            const pwordErrors: AccountMessageTypes[] = [];
            const confirmErrors: AccountMessageTypes[] = [];
            
            if(Array.isArray(action.payload)){
                action.payload.forEach((error) => {
                    switch(error){
                        case 1:
                            unameErrors.push(AccountMessages.UNAMELENGTH);
                            break;
                        case 2:
                            unameErrors.push(AccountMessages.UNAMETAKEN);
                            break;
                        case 3:
                            pwordErrors.push(AccountMessages.PWORDLENGTH);
                            break;
                        case 4:
                            confirmErrors.push(AccountMessages.PWORDNOMATCH);
                            break;
                        default:
                            break;
                    }
                });
            
                return {
                    ...state,
                    usernameObj: {
                        //Specifically define the entire usernameObj here because it is potentially undefined in TS (even though we know it isn't here)
                        value: state.usernameObj!.value,
                        errors: unameErrors
                    },
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
                break;
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

    const getUsernameErrors = formState.usernameObj!.errors.map((error) => {
        return <Banner text={error} style='error'/>;
    });

    const getPasswordErrors = formState.passwordObj.errors.map((error) => {
        return <Banner text={error} style='error'/>;
    });

    const getConfirmErrors = formState.confirmObj.errors.map((error) => {
        return <Banner text={error} style='error'/>;
    });
    
    return <Modal modalRef={modalRef} onClose={handleClose} title='Create Account'>
        <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.formRow}>
                <div className={`${styles.inputSection} ${formState.usernameObj!.errors.length && styles.error}`}>
                    <label className={styles.label} htmlFor='createUsername'>Username:</label>
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
                        className={styles.input}
                    />
                </div>
                <Banner text='Username cannot contain spaces' style='info'/>
                {formState.usernameObj!.errors.length > 0 && getUsernameErrors}
            </div>
            
            <div className={styles.formRow}>
                <div className={`${styles.inputSection} ${formState.passwordObj.errors.length && styles.error}`}>
                    <label className={styles.label} htmlFor='createPassword'>Password:</label>
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
                        className={styles.input}
                    />
                </div>
                <Banner text='Password cannot contain spaces' style='info'/>
                {formState.passwordObj.errors.length > 0 && getPasswordErrors}
            </div>

            <div className={styles.formRow}>
                <div className={`${styles.inputSection} ${formState.confirmObj.errors.length && styles.error}`}>
                    <label className={styles.label} htmlFor='createConfirm'>Confirm Password:</label>
                    <input 
                        type='password'
                        id='createConfirm'
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
            
            <button type='submit' disabled={!formState.canSubmit} className={styles.formButton}>Create</button>
        </form>
    </Modal>;
}