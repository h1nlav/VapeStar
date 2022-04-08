import { observer } from 'mobx-react-lite';
import React, { useContext, useEffect, useState } from 'react';
import { IMaskInput } from 'react-imask';
import { Context } from '../../..';
import { checkMobileNum } from '../../../api/userApi';
import AuthModal from '../../Modals/AuthModal/AuthModal/AuthModal';
import AlertsList from '../../UI/AlertsList/AlertsList';
import styles from './OrderUserInfo.module.css';

const OrderUserInfo = observer(() => {
    const { auth, order } = useContext(Context);

    const [authAlert, setAuthAlert] = useState(false);
    useEffect(async () => {
        if (order.mobileNum && order.mobileNum.length === 13) {
            let normalizedMobileNum = order.mobileNum;
            if (normalizedMobileNum.startsWith('+')) normalizedMobileNum = normalizedMobileNum.split('+').pop();
            if (normalizedMobileNum.startsWith('38')) normalizedMobileNum = normalizedMobileNum.split('38').pop();

            await checkMobileNum({ mobileNum: normalizedMobileNum })
                .then(data => data ? setAuthAlert(true) : setAuthAlert(false));
        } else setAuthAlert(false);
    }, [order.mobileNum])

    const [isAuthModalVisible, setIsAuthModalVisible] = useState(false);

    return (
        <div className={styles.userInfo}>
            <div className={styles.userInfo__sectionNumber}>1</div>

            <div className={styles.userInfo__content}>
                <span className={styles.userInfo__name}>Your contact details</span>

                {!auth.isAuth &&
                    <div className={styles.userinfo__authoriseOffer}>
                        <button>I am a new customer</button>
                        <button onClick={() => setIsAuthModalVisible(true)}>
                            I am a regular customer
                        </button>
                    </div>
                }

                {!auth.isAuth && authAlert &&
                    <div className={styles.userinfo__userExistAlert}>
                        <span>This user already exists, </span>
                        <span
                            onClick={() => setIsAuthModalVisible(true)}
                        >
                            please login
                        </span>
                    </div>
                }

                <div className={styles.fields}>
                    <div className={styles.fields__flex}>
                        <div className={styles.fields__field}>
                            <span className={styles.fields__label}>Name</span>
                            <input type='text'
                                className={styles.fields__input}
                                style={order.nameCheck.length == 0 ? { borderColor: '#797878' } : { borderColor: '#f84147' }}
                                value={order.name || ''}
                                onChange={e => order.setName(e.target.value)}
                            />
                            <AlertsList checkArray={order.nameCheck} />
                        </div>

                        <div className={styles.fields__field}>
                            <span className={styles.fields__label}>Surname</span>
                            <input type='text'
                                className={styles.fields__input}
                                style={order.surnameCheck.length == 0 ? { borderColor: '#797878' } : { borderColor: '#f84147' }}
                                value={order.surname || ''}
                                onChange={e => order.setSurname(e.target.value)}
                            />
                            <AlertsList checkArray={order.surnameCheck} />
                        </div>
                    </div>

                    <div className={styles.fields__field}>
                        <span className={styles.fields__label}>Phone number</span>
                        <IMaskInput
                            mask='+[380] 00 000 00 00'
                            value={order.mobileNum || ''}
                            className={styles.fields__input}
                            style={order.mobileNumCheck.length == 0 ? { borderColor: '#797878' } : { borderColor: '#f84147' }}
                            onChange={(e) => order.setMobileNum(e.target.value)}
                        />
                        <AlertsList checkArray={order.mobileNumCheck} />
                    </div>
                </div>

            </div>

            <AuthModal isVisible={isAuthModalVisible} closeModal={() => setIsAuthModalVisible(false)} />
        </div>
    );
});

export default OrderUserInfo;