import React, { useState } from 'react';
import { deleteDeliveryCompany } from '../../../../api/deliveryApi';
import ConfirmationModal from '../../../UI/ConfirmationModal/ConfirmationModal';
import FullInfoField from '../../../UI/FullInfoField/FullInfoField';
import ShortInfoContainer from '../../../UI/ShortInfoContainer/ShortInfoContainer';
import AdminChangeDeliveryCompany from '../AdminChangeDeliveryCompany/AdminChangeDeliveryCompany';
import styles from './AdminDeliveryCompany.module.css';

const AdminDeliveryCompany = ({ deliveryCompany, fetchAndShowDeliveryInfo }) => {
    const [isCompanyOpened, setIsCompanyOpened] = useState(false);
    const [isCompanyChanging, setIsCompanyChanging] = useState(false);

    const [isConfirmationModalVisible, setIsConfirmationModalVisible] = useState(false);
    const [confirmationModalMessage, setConfirmationModalMessage] = useState('');
    const [confirmationModalCallback, setConfirmationModalCallback] = useState(null);

    const removeAndShowCompany = async (id) => {
        await deleteDeliveryCompany({ id })
            .then(async () => await fetchAndShowDeliveryInfo());
    }

    return (
        <li className={styles.deliveryCompany}>
            <ShortInfoContainer
                id={`№ ${deliveryCompany.id}`}
                isOpened={isCompanyOpened}
                onClick={() => setIsCompanyOpened(!isCompanyOpened)}
            >
                <div className={styles.shortInfo__name}>{deliveryCompany.name}</div>
            </ShortInfoContainer>


            {isCompanyOpened &&
                <div className={styles.deliveryCompany__opened}>
                    {isCompanyChanging
                        ?
                        <AdminChangeDeliveryCompany
                            deliveryCompany={deliveryCompany}
                            fetchAndShowDeliveryInfo={fetchAndShowDeliveryInfo}
                            setIsCompanyChanging={setIsCompanyChanging}
                        />
                        :
                        <div className={styles.fullInfo}>
                            <FullInfoField fieldName={'Delivery service name'} fieldValue={deliveryCompany.name} />

                            <div className={styles.fullInfo__buttons}>
                                <button
                                    className={styles.fullInfo__removeButton}
                                    onClick={() => {
                                        setConfirmationModalMessage(<span>Are you sure you want to delete the delivery service  {deliveryCompany.name}?</span>);
                                        setConfirmationModalCallback(() => () => removeAndShowCompany(deliveryCompany.id));
                                        setIsConfirmationModalVisible(true);
                                    }}
                                >
                                    Delete
                                </button>
                                <button
                                    className={styles.fullInfo__editButton}
                                    onClick={() => setIsCompanyChanging(!isCompanyChanging)}
                                >
                                    Edit
                                </button>
                            </div>
                        </div>
                    }
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

export default AdminDeliveryCompany;