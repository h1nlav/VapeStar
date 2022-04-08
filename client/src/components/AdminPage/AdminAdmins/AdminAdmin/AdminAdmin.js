import React, { useState } from 'react';
import { deleteUser } from '../../../../api/userApi';
import AuthStore from '../../../../store/AuthStore';
import ConfirmationModal from '../../../UI/ConfirmationModal/ConfirmationModal';
import FullInfoField from '../../../UI/FullInfoField/FullInfoField';
import ShortInfoContainer from '../../../UI/ShortInfoContainer/ShortInfoContainer';
import AdminChangeAdmin from '../AdminChangeAdmin/AdminChangeAdmin';
import styles from './AdminAdmin.module.css';

const AdminAdmin = ({ admin, fetchAndShowAdmins }) => {
    const [isAdminOpened, setIsAdminOpened] = useState(false);
    const [isAdminChanging, setIsAdminChanging] = useState(false);

    const [isConfirmationModalVisible, setIsConfirmationModalVisible] = useState(false);
    const [confirmationModalMessage, setConfirmationModalMessage] = useState('');
    const [confirmationModalCallback, setConfirmationModalCallback] = useState(null);

    const removeAndShowAdmin = async (id) => {
        await deleteUser({ id }).then(async () => await fetchAndShowAdmins());
    }

    const createAdminInfoChangable = (admin) => {
        const adminInfo = new AuthStore();
        adminInfo.setName(admin.name);
        adminInfo.setSurname(admin.surname);
        adminInfo.setEmail(admin.email);
        adminInfo.setMobileNum(admin.mobileNum);
        return adminInfo;
    }

    return (
        <li className={styles.admin}>
            <ShortInfoContainer
                id={`№ ${admin.id}`}
                isOpened={isAdminOpened}
                onClick={() => setIsAdminOpened(!isAdminOpened)}
            >
                <div className={styles.shortInfo__name}>{admin.name} {admin.surname}</div>
            </ShortInfoContainer>

            {isAdminOpened &&
                <div className={styles.admin__opened}>
                    {isAdminChanging
                        ? <AdminChangeAdmin
                            admin={admin}
                            adminInfo={createAdminInfoChangable(admin)}
                            fetchAndShowAdmins={fetchAndShowAdmins}
                            setIsAdminChanging={setIsAdminChanging}
                        />
                        : <div className={styles.fullInfo}>
                            <div className={styles.fullInfo__fields}>
                                <FullInfoField fieldName={'Name'} fieldValue={admin.name} />
                                <FullInfoField fieldName={'Surname'} fieldValue={admin.surname} />
                                <FullInfoField fieldName={'Phone number'} fieldValue={admin.mobileNum} />
                                <FullInfoField fieldName={'Email'} fieldValue={admin.email} />
                            </div>

                            <div className={styles.fullInfo__buttons}>
                                <button
                                    className={styles.fullInfo__removeButton}
                                    onClick={() => {
                                        setConfirmationModalMessage(<span>Are you sure you want to remove the administrator {admin.name} {admin.surname}?</span>);
                                        setConfirmationModalCallback(() => () => removeAndShowAdmin(admin.id));
                                        setIsConfirmationModalVisible(true);
                                    }}
                                >
                                    Delete
                                </button>
                                <button
                                    className={styles.fullInfo__editButton}
                                    onClick={() => setIsAdminChanging(!isAdminChanging)}
                                >
                                    Edit
                                </button>
                            </div>
                            <ConfirmationModal
                                isVisible={isConfirmationModalVisible}
                                setIsVisible={setIsConfirmationModalVisible}
                                message={confirmationModalMessage}
                                callback={confirmationModalCallback}
                            />
                        </div>
                    }
                </div>
            }
        </li>
    );
};

export default AdminAdmin;