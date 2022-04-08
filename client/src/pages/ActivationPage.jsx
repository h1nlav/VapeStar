import React, { useContext, useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Context } from '..';
import { activate } from '../api/userApi';
import { MAIN_ROUTE } from '../router/consts';
import jwt_decode from 'jwt-decode';
import DotsLoader from '../components/Loaders/DotsLoader/DotsLoader';
import styles from '../css/ActivationPage.module.css'

const ActivationPage = () => {
    const { auth, order } = useContext(Context);
    const { activationLink } = useParams();

    const [isActivation, setIsActivation] = useState([true, false]);
    const [activationText, setActivationText] = useState('Account activation')

    useEffect(() => {
        let isUnmount = false;

        activate(activationLink).then(data => {
            if (data.token) {
                if (!auth.isAuth) {
                    auth.setIsAuth(true);
                    auth.setUser(jwt_decode(data.token));
                    order.setCart(JSON.parse(localStorage.getItem('cart')) || []);
                }
                !isUnmount && setActivationText('Activation successful');
                !isUnmount && setIsActivation([false, true]);
            } else if (data.alert && !isUnmount) {
                !isUnmount && setActivationText('Link expired');
                !isUnmount && setIsActivation([false, false]);
            }
        });

        return () => { isUnmount = true };
    }, []);

    return (
        <div className={styles.activation}>
            <div className={styles.activation__content} >
                {!isActivation[0] && isActivation[1] && <div className={styles.activation__activatedIcon} />}
                {!isActivation[0] && !isActivation[1] && <div className={styles.activation__notActivatedIcon} />}

                <span className={styles.activation__text}>{activationText}</span>

                {isActivation[0]
                    ? <DotsLoader />
                    :

                    <Link to={MAIN_ROUTE} className={styles.activation__link}>
                        <button className={styles.activation__button}>
                            <span>To Home Page</span>
                        </button>
                    </Link>
                }
            </div>
        </div>
    );
};

export default ActivationPage;