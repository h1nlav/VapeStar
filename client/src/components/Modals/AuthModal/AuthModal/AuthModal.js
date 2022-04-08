import React, { useContext, useEffect, useState } from 'react';
import { Context } from '../../../..';
import { BodyScrollOff, BodyScrollOn } from '../../../../utils/changeBodyScroll';
import Login from '../Login/Login';
import Registration from '../Registration/Registration';
import ChangePassword from '../ChangePassword/ChangePassword';
import styles from './AuthModal.module.css';
import ModalName from '../../../UI/ModalName/ModalName';

const AuthModal = ({ isVisible, closeModal }) => {
    useEffect(() => isVisible ? BodyScrollOff() : BodyScrollOn(), [isVisible]);

    const { auth } = useContext(Context);
    const [isBgDown, setIsBgDown] = useState(false);
    const [authModalContent, setAuthModalContent] = useState('Login');

    useEffect(() => auth.resetAuthStore(), [authModalContent]);

    const closeAuthModal = () => {
        auth.resetAuthStore();
        setAuthModalContent('Login');
        closeModal();
    }

    if (!isVisible) return (<div></div>);
    return (
        <div id='bg' className={styles.modal}
            onMouseDown={e => e.target.id == 'bg' && setIsBgDown(true)}
            onMouseUp={e => {
                if (e.target.id == 'bg' && isBgDown) closeAuthModal();
                setIsBgDown(false);
            }}
        >
            <div className={styles.modal__wrapper}>
                <ModalName modalName={authModalContent} callback={() => closeAuthModal()} />
                <div className={styles.modal__content}>
                    {authModalContent === 'Login' && <Login setContent={setAuthModalContent} closeModal={closeAuthModal} />}
                    {authModalContent === 'Registration' && <Registration setContent={setAuthModalContent} closeModal={closeAuthModal} />}
                    {authModalContent === 'Reset your password' && <ChangePassword closeModal={closeAuthModal} setContent={setAuthModalContent} />}
                </div>
            </div>
        </div>
    );
};

export default AuthModal;