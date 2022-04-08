import { observer } from 'mobx-react-lite';
import React, { useContext, useState } from 'react';
import jwt_decode from 'jwt-decode';
import { Context } from '../../../..';
import { login } from '../../../../api/userApi';
import Activation from '../Activation/Activation';
import styles from './Login.module.css';
import AlertsList from '../../../UI/AlertsList/AlertsList';

const Login = observer(({ closeModal, setContent }) => {
    const { auth, order } = useContext(Context);
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [isActivationLinkSent, setIsActivationLinkSent] = useState(false);

    const loginAttempt = async () => {
        !auth.login && auth.setLogin('');
        !auth.loginPassword && auth.setLoginPassword('');

        if (auth.loginCheck.length == 0 && auth.loginPasswordCheck.length == 0) {
            let normalizedLogin = auth.login;
            if (normalizedLogin.match("^[0-9+]*$")) {
                if (normalizedLogin.length === 13 && normalizedLogin.startsWith('+')) normalizedLogin = normalizedLogin.split('+').pop();
                if (normalizedLogin.length === 12 && normalizedLogin.startsWith('38')) normalizedLogin = normalizedLogin.split('38').pop();
            }

            await login({ login: normalizedLogin, password: auth.loginPassword })
                .then(data => {
                    if (data.login) auth.setLoginCheck(data.login);
                    else if (data.password) auth.setLoginPasswordCheck([data.password]);
                    else if (data.activation) setIsActivationLinkSent(true);
                    else if (data.token) {
                        auth.setIsAuth(true);
                        auth.setUser(jwt_decode(data.token));
                        order.setCart(JSON.parse(localStorage.getItem('cart')) || []);
                        closeModal();
                    }
                })
        }
    }

    if (isActivationLinkSent) {
        return (
            <Activation
                text={<span>To complete the registration,<br />follow the link in the email</span>}
                closeModal={() => {
                    setIsActivationLinkSent(false);
                    closeModal();
                }}
            />
        )
    }
    return (
        <div
            className={styles.modal__login}
            onKeyDown={e => e.key == 'Enter' && loginAttempt()}
        >
            <div className={styles.login}>
                <span className={styles.login__text}>Email or phone number</span>
                <input
                    type='text'
                    className={styles.login__input}
                    style={auth.loginCheck.length == 0 ? { borderColor: '#797878' } : { borderColor: '#f84147' }}
                    value={auth.login || ''}
                    onChange={e => auth.setLogin(e.target.value)}
                />
                <AlertsList checkArray={auth.loginCheck} />
            </div>

            <div className={styles.password}>
                <span className={styles.password__text}>Password</span>
                <div className={styles.password_wrapper}>
                    <input
                        type={isPasswordVisible ? 'text' : 'password'} className={styles.password__input}
                        style={auth.loginPasswordCheck.length == 0 ? { borderColor: '#797878' } : { borderColor: '#f84147' }}
                        value={auth.loginPassword || ''}
                        onChange={e => auth.setLoginPassword(e.target.value)}
                    />
                    <div
                        className={isPasswordVisible
                            ? `${styles.password_img} ${styles.password_visibleImg}`
                            : styles.password_img}
                        onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                        style={auth.loginPasswordCheck.length == 0 ? { borderColor: '#797878' } : { borderColor: '#f84147' }}
                    ><div></div></div>
                </div>
                <AlertsList checkArray={auth.loginPasswordCheck} />
            </div>

            <div className={styles.changePassword}>
                <span
                    className={styles.changePassword__link}
                    onClick={() => setContent('Reset your password')}
                >
                    Forgot password?
                </span>
            </div>

            <button className={styles.loginAttempt__button} onClick={() => loginAttempt()}>
                <span>Sign in</span>
            </button>

            <div className={styles.registration}>
                <span
                    className={styles.registration__link}
                    onClick={() => setContent('Registration')}
                >
                    Create a new account
                </span>
            </div>
        </div>
    );
});

export default Login;