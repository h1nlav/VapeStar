import React, { useState } from 'react';
import { blockUser, unblockUser } from '../../../../api/userApi';
import ConfirmationModal from '../../../UI/ConfirmationModal/ConfirmationModal';
import FullInfoField from '../../../UI/FullInfoField/FullInfoField';
import ShortInfoContainer from '../../../UI/ShortInfoContainer/ShortInfoContainer';
import styles from './AdminUser.module.css';

const AdminUser = ({ user, fetchAndShowUsers, option }) => {
    const [isUserOpened, setIsUserOpened] = useState(false);

    const [isConfirmationModalVisible, setIsConfirmationModalVisible] = useState(false);
    const [confirmationModalMessage, setConfirmationModalMessage] = useState('');
    const [confirmationModalCallback, setConfirmationModalCallback] = useState(null);

    const blockAndShowUser = async (id) => {
        await blockUser({ id })
            .then(async () => await fetchAndShowUsers());
    }

    const unblockAndShowUser = async (id) => {
        await unblockUser({ id })
            .then(async () => await fetchAndShowUsers());
    }

    return (
        <li className={styles.user}>
            <ShortInfoContainer
                id={`№ ${user.id}`}
                isOpened={isUserOpened}
                onClick={() => setIsUserOpened(!isUserOpened)}
            >
                <div className={styles.shortInfo__name}>{user.name} {user.surname}</div>
                <div className={styles.shortInfo__mobileNum}>{user.mobileNum}</div>
            </ShortInfoContainer>

            {isUserOpened &&
                <div className={styles.user__opened}>
                    <div className={styles.fullInfo}>
                        <div className={styles.fullInfo__fields}>
                            <FullInfoField fieldName={'Name'} fieldValue={user.name} />
                            <FullInfoField fieldName={'Surname'} fieldValue={user.surname} />
                            <FullInfoField fieldName={'Phone number'} fieldValue={user.mobileNum} />
                            <FullInfoField fieldName={'Email'} fieldValue={user.email} />
                        </div>

                        <div className={styles.fullInfo__buttons}>
                            <button
                                className={styles.fullInfo__blockButton}
                                onClick={() => {
                                    if (option == 'Users') {
                                        setConfirmationModalMessage(<span>Are you sure you want to block user {user.name} {user.surname}?</span>);
                                        setConfirmationModalCallback(() => () => blockAndShowUser(user.id));
                                        setIsConfirmationModalVisible(true);
                                    } else if (option == 'Blocked Users') {
                                        setConfirmationModalMessage(<span>Are you sure you want to unblock user {user.name} {user.surname}?</span>);
                                        setConfirmationModalCallback(() => () => unblockAndShowUser(user.id));
                                        setIsConfirmationModalVisible(true);
                                    }
                                }}
                            >
                                {option == 'Users' && 'Block'}
                                {option == 'Blocked Users' && 'Unblock'}
                            </button>
                        </div>
                    </div>
                </div>
            }
            <ConfirmationModal
                isVisible={isConfirmationModalVisible}
                setIsVisible={setIsConfirmationModalVisible}
                message={confirmationModalMessage}
                callback={confirmationModalCallback}
            />
        </li>
    );
};

export default AdminUser;