import { useReducer, type RefObject } from 'react';

import Modal from '../generic/Modal';
import Banner from '../generic/Banner';
import { createAccount } from '../../utils/gateway';
import { loginThunk } from '../../store/sessionSlice';
import { type AccountResponse, type AccountMessageTypes, type AccountField, AccountMessages, type Player } from '../../utils/types';
import { useAppDispatch } from '../../utils/hooks';

import styles from './AccountStyles.module.scss';

type Props = {
    modalRef: RefObject<HTMLDialogElement | null>
};

type reducerAction = {
    type: 'init' | 'username' | 'password' | 'confirm' | 'server',
    payload?: { value: string, error: boolean } | number[]
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
    mainSuccess: null,
    canSubmit: false
}

const checkCanSubmit = (nameField: AccountField, passField: AccountField, confirmField: AccountField) => !((nameField.value.length === 0 || nameField.errors.length !== 0) || (passField.value.length === 0 || passField.errors.length !== 0) || (confirmField.value.length === 0 || confirmField.errors.length !== 0));

const reducer = (state: AccountResponse, action: reducerAction): AccountResponse => {
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
            if(!Array.isArray(action.payload)){
                return {
                    ...initState,
                    mainError: action.payload.value as AccountMessageTypes
                };
            }
            break;
        }
        case 'username': {
            if(!Array.isArray(action.payload)){
                const username = action.payload.value.trim();
                const errors: AccountMessageTypes[] = [];

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
                    canSubmit: checkCanSubmit({value: username, errors}, state.passwordObj, state.confirmObj)
                };
            }
            break;
        }
        case 'password': {
            if(!Array.isArray(action.payload)){
                const password = action.payload.value.trim();
                const pWordErrors: AccountMessageTypes[] = [];
                const confirmErrors: AccountMessageTypes[] = [];
                
                //Check if the password field is correct by itself.
                if(password.length < 12) {
                    pWordErrors.push(AccountMessages.PWORDLENGTH);
                }else if(password.length > 30) {
                    pWordErrors.push(AccountMessages.PWORDLENGTH);
                }

                /*
                 * Check if the confirm field is also correct. If this isn't also checked, changing the password after entering
                 * the confirm field will not generate an error.
                 */
                if(password !== state.confirmObj.value){
                    confirmErrors.push(AccountMessages.PWORDNOMATCH);
                }

                return {
                    ...state,
                    passwordObj: {
                        value: password,
                        errors: pWordErrors
                    },
                    confirmObj: {
                        ...state.confirmObj,
                        errors: confirmErrors
                    },
                    canSubmit: checkCanSubmit(state.usernameObj!, {value: password, errors: pWordErrors}, {value: state.confirmObj.value, errors: confirmErrors})
                };
            }
            break;
        }
        case 'confirm': {
            if(!Array.isArray(action.payload)){
                const confirm = action.payload.value.trim();
                const errors: AccountMessageTypes[] = [];

                if(state.passwordObj.value !== confirm){
                    errors.push(AccountMessages.PWORDNOMATCH);
                }

                return {
                    ...state,
                    confirmObj: {
                        value: confirm,
                        errors
                    },
                    canSubmit: checkCanSubmit(state.usernameObj!, state.passwordObj, {value: confirm, errors})
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
                        //Specifically define the entire usernameObj here because it is potentially undefined in TS (even though we know it is defined here)
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
        default:
    }

    /*
    * Since the switch statements only return a new state if the payload is of a certain datatype, this final return prevents
    * each statement from having an ...else{ return state } block.
    */
    return state;
};

export default function Create({modalRef}: Props) {
    const [formState, localDispatch] = useReducer(reducer, initState);

    const dispatch = useAppDispatch();

    const handleUsername = (event: React.ChangeEvent<HTMLInputElement>) => {
        localDispatch({type: 'username', payload: {value: event.target.value, error: false}});
    };

    const handlePassword = (event: React.ChangeEvent<HTMLInputElement>) => {
        localDispatch({type: 'password', payload: {value: event.target.value, error: false}});
    };

    const handleConfirm = (event: React.ChangeEvent<HTMLInputElement>) => {
        localDispatch({type: 'confirm', payload: {value: event.target.value, error: false}});
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
                localDispatch({type: 'init', payload: {value: AccountMessages.SERVERERROR, error: true}});
                break;
            }
        }
    };

    const handleClose = () => {
        localDispatch({type: 'init'});
    }

    const getErrors = (errors: AccountMessageTypes[]) => errors.map((error) => <Banner key={error} text={error} style='error'/>);
    
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
                {formState.usernameObj!.errors.length > 0 && getErrors(formState.usernameObj!.errors)}
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
                {formState.passwordObj.errors.length > 0 && getErrors(formState.passwordObj.errors)}
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
                {formState.confirmObj.errors.length > 0 && getErrors(formState.confirmObj.errors)}
            </div>

            {formState.mainError !== null && <div className={styles.formRow}><Banner text={formState.mainError} style='error'/></div>}
            
            <button type='submit' disabled={!formState.canSubmit} className={styles.formButton}>Create</button>
        </form>
    </Modal>;
}