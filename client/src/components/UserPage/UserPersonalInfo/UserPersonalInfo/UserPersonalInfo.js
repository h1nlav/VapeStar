import { observer } from 'mobx-react-lite';
import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Context } from '../../../..';
import { MAIN_ROUTE } from '../../../../router/consts';
import ConfirmationModal from '../../../UI/ConfirmationModal/ConfirmationModal';
import FullInfoField from '../../../UI/FullInfoField/FullInfoField';
import UserChangePersonalInfo from '../UserChangePersonalInfo/UserChangePersonalInfo';
import styles from './UserPersonalInfo.module.css';

const UserPersonalInfo = observer(() => {
    const { auth, order } = useContext(Context);
    const navigation = useNavigate();

    const [isUserInfoChanging, setIsUserInfoChanging] = useState(false);

    const [isConfirmationModalVisible, setIsConfirmationModalVisible] = useState(false);
    const [confirmationModalMessage, setConfirmationModalMessage] = useState('');
    const [confirmationModalCallback, setConfirmationModalCallback] = useState(null);
    const exitFromAcc = () => {
        localStorage.removeItem('token');
        auth.setUser([]);
        auth.setIsAuth(false);
        order.clearPersonalInfo();
        navigation(MAIN_ROUTE);
    }

    return (
        <div className={styles.userInfo}>
            <div className={styles.userInfo__name}>
                <h1>Personal information</h1>
            </div>
            {isUserInfoChanging
                ? <UserChangePersonalInfo setIsUserInfoChanging={setIsUserInfoChanging} />
                :
                <div className={styles.fullInfo}>
                    <div className={styles.fullInfo__fields}>
                        <FullInfoField fieldName={'Name'} fieldValue={auth.user.name} />
                        <FullInfoField fieldName={'Surname'} fieldValue={auth.user.surname} />
                        <FullInfoField fieldName={'Email'} fieldValue={auth.user.email} />
                        <FullInfoField fieldName={'Phone number'} fieldValue={auth.user.mobileNum} />
                    </div>

                    <div className={styles.fullInfo__buttons}>
                        <button
                            className={styles.fullInfo__editButton}
                            onClick={() => setIsUserInfoChanging(true)}
                        >
                            Change
                        </button>
                        
                        <button
                            className={styles.fullInfo__exitButton}
                            onClick={() => {
                                setConfirmationModalMessage(<span>Are you sure you want to log out of your account?</span>);
                                setConfirmationModalCallback(() => () => exitFromAcc())
                                setIsConfirmationModalVisible(true);
                            }}
                        >
                            Sign out
                        </button>
                    </div>
                </div>
            }

            <ConfirmationModal
                isVisible={isConfirmationModalVisible}
                setIsVisible={setIsConfirmationModalVisible}
                message={confirmationModalMessage}
                callback={confirmationModalCallback}
            />
        </div>
    );
});

export default UserPersonalInfo;