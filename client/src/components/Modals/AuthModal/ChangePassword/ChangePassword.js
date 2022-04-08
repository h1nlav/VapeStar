import { observer } from 'mobx-react-lite';
import React, { useContext, useState } from 'react';
import { Context } from '../../../..';
import { createChangePasswordLink } from '../../../../api/userApi';
import AlertsList from '../../../UI/AlertsList/AlertsList';
import Activation from '../Activation/Activation';
import styles from './ChangePassword.module.css';

const ChangePassword = observer(({ closeModal, setContent }) => {
    const { auth } = useContext(Context);
    const [isChangePasswordLinkSent, setIsChangePasswordLinkSent] = useState(false);

    const changePasswordAttempt = async () => {
        !auth.login && auth.setLogin('');

        if (auth.loginCheck.length == 0) {
            let normalizedLogin = auth.login;
            if (normalizedLogin.match("^[0-9+]*$")) {
                if (normalizedLogin.length === 13 && normalizedLogin.startsWith('+')) normalizedLogin = normalizedLogin.split('+').pop();
                if (normalizedLogin.length === 12 && normalizedLogin.startsWith('38')) normalizedLogin = normalizedLogin.split('38').pop();
            }

            await createChangePasswordLink({ login: normalizedLogin })
                .then(data => {
                    if (data.login) auth.setLoginCheck(data.login);
                    if (data.confirmation) setIsChangePasswordLinkSent(true);
                });
        }
    }

    if (isChangePasswordLinkSent) {
        return (
            <Activation
                text={'An email with instructions to change your password has been sent to your email.'}
                closeModal={() => {
                    setIsChangePasswordLinkSent(false);
                    closeModal();
                }}
            />
        )
    }
    return (
        <div
            className={styles.modal__changePassword}
            onKeyDown={e => e.key == 'Enter' && changePasswordAttempt()}
        >
            <div className={styles.email}>
                <span className={styles.email__text}>Email or phone number</span>
                <input type='text'
                    className={styles.email__input}
                    style={auth.loginCheck.length == 0 ? { borderColor: '#797878' } : { borderColor: '#f84147' }}
                    value={auth.login || ''}
                    onChange={e => auth.setLogin(e.target.value)}
                />
                <AlertsList checkArray={auth.loginCheck} />
            </div>

            <button
                className={styles.changePasswordAttempt__button}
                onClick={() => changePasswordAttempt()}
            >
                <span>Сhange password</span>
            </button>

            <div className={styles.login}>
                <span
                    className={styles.login__link}
                    onClick={() => setContent('Login')}
                >
                    I remembered my password
                </span>
            </div>
        </div>
    );
});

export default ChangePassword;