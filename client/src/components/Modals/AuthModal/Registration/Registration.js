import { observer } from 'mobx-react-lite';
import React, { useContext, useState } from 'react';
import { IMaskInput } from "react-imask";
import { Context } from '../../../..';
import { registration } from '../../../../api/userApi';
import AlertsList from '../../../UI/AlertsList/AlertsList';
import Activation from '../Activation/Activation';
import styles from './Registration.module.css';

const Registration = observer(({ setContent, closeModal }) => {
    const { auth } = useContext(Context);
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [isActivationLinkSent, setIsActivationLinkSent] = useState(false);

    const registrationAttempt = async () => {
        !auth.name && auth.setName('');
        !auth.surname && auth.setSurname('');
        !auth.mobileNum && auth.setMobileNum('');
        !auth.email && auth.setEmail('');
        !auth.regPassword && auth.setRegPassword('');

        if (auth.nameCheck == 0 && auth.surnameCheck.length == 0 && auth.mobileNumCheck.length == 0
            && auth.emailCheck.length == 0 && auth.regPasswordCheck.length == 0) {

            let normalizedMobileNum = auth.mobileNum;
            if (normalizedMobileNum.startsWith('+')) normalizedMobileNum = normalizedMobileNum.split('+').pop();
            if (normalizedMobileNum.startsWith('38')) normalizedMobileNum = normalizedMobileNum.split('38').pop();

            await registration({
                name: auth.name,
                surname: auth.surname,
                mobileNum: normalizedMobileNum,
                email: auth.email,
                password: auth.regPassword
            }).then(data => {
                if (data.mobileNum) auth.setMobileNumCheck(data.mobileNum);
                if (data.email) auth.setEmailCheck(data.email);
                if (data.confirmation) setIsActivationLinkSent(true);
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
        );
    }
    return (
        <div
            className={styles.modal__registration}
            onKeyDown={e => e.key == 'Enter' && registrationAttempt()}
        >
            <div className={styles.name}>
                <span className={styles.name__text}>Name</span>
                <input type='text'
                    className={styles.name__input}
                    style={auth.nameCheck.length == 0 ? { borderColor: '#797878' } : { borderColor: '#f84147' }}
                    value={auth.name || ''}
                    onChange={e => auth.setName(e.target.value)}
                />
                <AlertsList checkArray={auth.nameCheck} />
            </div>

            <div className={styles.surname}>
                <span className={styles.surname__text}>Surname</span>
                <input type='text'
                    className={styles.surname__input}
                    style={auth.surnameCheck.length == 0 ? { borderColor: '#797878' } : { borderColor: '#f84147' }}
                    value={auth.surname || ''}
                    onChange={e => auth.setSurname(e.target.value)}
                />
                <AlertsList checkArray={auth.surnameCheck} />
            </div>

            <div className={styles.mobileNum}>
                <span className={styles.mobileNum__text}>Phone number</span>
                <IMaskInput
                    mask='+[380] 00 000 00 00'
                    className={styles.mobileNum__input}
                    style={auth.mobileNumCheck.length == 0 ? { borderColor: '#797878' } : { borderColor: '#f84147' }}
                    onAccept={(value, mask) => auth.setMobileNum(value)}
                />
                <AlertsList checkArray={auth.mobileNumCheck} />
            </div>

            <div className={styles.email}>
                <span className={styles.email__text}>Email</span>
                <input type='text'
                    className={styles.email__input}
                    style={auth.emailCheck.length == 0 ? { borderColor: '#797878' } : { borderColor: '#f84147' }}
                    value={auth.email || ''}
                    onChange={e => auth.setEmail(e.target.value)}
                />
                <AlertsList checkArray={auth.emailCheck} />
            </div>

            <div className={styles.password}>
                <span className={styles.password__text}>Create a password</span>
                <div className={styles.password_wrapper}>
                    <input
                        type={isPasswordVisible ? 'text' : 'password'} className={styles.password__input}
                        style={auth.regPasswordCheck.length == 0 ? { borderColor: '#797878' } : { borderColor: '#f84147' }}
                        value={auth.regPassword || ''}
                        onChange={e => auth.setRegPassword(e.target.value)}
                    />
                    <div
                        className={isPasswordVisible
                            ? `${styles.password_img} ${styles.password_visibleImg}`
                            : styles.password_img}
                        onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                        style={auth.regPasswordCheck.length == 0 ? { borderColor: '#797878' } : { borderColor: '#f84147' }}
                    ><div></div></div>
                </div>
                <AlertsList checkArray={auth.regPasswordCheck} />
            </div>

            <button className={styles.registrationAttempt__button}
                onClick={() => registrationAttempt()}
            >
                <span>
                    Sign up
                </span>
            </button>

            <div className={styles.login}>
                <span
                    className={styles.login__link}
                    onClick={() => setContent('Login')}
                >
                    I'm already registered
                </span>
            </div>
        </div>
    );
});

export default Registration;