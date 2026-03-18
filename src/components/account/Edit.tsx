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
    payload?: { value: string, error: boolean } | number[]
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
    mainSuccess: null,
    canSubmit: false
}

const checkCanSubmit = (passError: AccountMessageTypes[], confirmError: AccountMessageTypes[]) => !(passError.length || confirmError.length);

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
                if(action.payload.error === true){
                    return {
                        ...initState,
                        mainError: action.payload.value as AccountMessageTypes
                    };
                }else{
                    return {
                        ...initState,
                        mainSuccess: action.payload.value as AccountMessageTypes
                    };
                }
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
                    canSubmit: checkCanSubmit(pWordErrors, confirmErrors)
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

    /*
    * Since the switch statements only return a new state if the payload is of a certain datatype, this final return prevents
    * each statement from having an ...else{ return state } block.
    */
    return state;
};

export default function Edit({modalRef}: Props) {
    const [formState, localDispatch] = useReducer(reducer, initState);

    const authToken = useAppSelector(selectAuthToken);

    const handlePassword = (event: React.ChangeEvent<HTMLInputElement>) => {
        localDispatch({type: 'password', payload: {value: event.target.value, error: false}});
    };

    const handleConfirm = (event: React.ChangeEvent<HTMLInputElement>) => {
        localDispatch({type: 'confirm', payload: {value: event.target.value, error: false}});
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if(authToken){
            const accountResponse = await editAccount(authToken, formState.passwordObj.value, formState.confirmObj.value);
            const errors: number[] = await accountResponse.json();

            switch(accountResponse.status){
                case 200: {
                    localDispatch({type: 'init', payload: {error: false, value: AccountMessages.PWORDCHANGED}});
                    break;
                }
                case 400: {
                    localDispatch({type: 'server', payload: errors});
                    break;
                }
                default: {
                    localDispatch({type: 'init', payload: {error: true, value: AccountMessages.SERVERERROR}});
                    break;
                }
            }
        }
    };

    const handleClose = () => {
        localDispatch({type: 'init'});
    }

    const getErrors = (errors: AccountMessageTypes[]) => {
        return errors.map((error) => {
            return <Banner text={error} style='error'/>;
        });
    };
    
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
                {formState.passwordObj.errors.length > 0 && getErrors(formState.passwordObj.errors)}
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
                {formState.confirmObj.errors.length > 0 && getErrors(formState.confirmObj.errors)}
            </div>

            {formState.mainError !== null && <div className={styles.formRow}><Banner text={formState.mainError} style='error'/></div>}
            {formState.mainSuccess !== null && <div className={styles.formRow}><Banner text={formState.mainSuccess} style='success'/></div>}
            
            <button type='submit' disabled={!formState.canSubmit} className={styles.formButton}>Update</button>
        </form>
    </Modal>;
}