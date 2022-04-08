import React, { useState } from 'react';
import { deleteDeliveryCity } from '../../../../api/deliveryApi';
import ConfirmationModal from '../../../UI/ConfirmationModal/ConfirmationModal';
import FullInfoField from '../../../UI/FullInfoField/FullInfoField';
import ShortInfoContainer from '../../../UI/ShortInfoContainer/ShortInfoContainer';
import AdminChangeDeliveryCity from '../AdminChangeDeliveryCity/AdminChangeDeliveryCity';
import styles from './AdminDeliveryCity.module.css'

const AdminDeliveryCity = ({ deliveryCity, fetchAndShowDeliveryInfo }) => {
    const [isCityOpened, setIsCityOpened] = useState(false);
    const [isCityChanging, setIsCityChanging] = useState(false);

    const [isConfirmationModalVisible, setIsConfirmationModalVisible] = useState(false)
    const [confirmationModalMessage, setConfirmationModalMessage] = useState('')
    const [confirmationModalCallback, setConfirmationModalCallback] = useState(null)

    const removeAndShowCity = async (id) => {
        await deleteDeliveryCity({ id })
            .then(async () => await fetchAndShowDeliveryInfo());
    }

    return (
        <li className={styles.deliveryCity}>
            <ShortInfoContainer
                id={`№ ${deliveryCity.id}`}
                isOpened={isCityOpened}
                onClick={() => setIsCityOpened(!isCityOpened)}
            >
                <div className={styles.shortInfo__name}>{deliveryCity.name}</div>
            </ShortInfoContainer>

            {isCityOpened &&
                <div className={styles.deliveryCity__opened}>
                    {isCityChanging
                        ?
                        <AdminChangeDeliveryCity
                            deliveryCity={deliveryCity}
                            fetchAndShowDeliveryInfo={fetchAndShowDeliveryInfo}
                            setIsCityChanging={setIsCityChanging}
                        />
                        :
                        <div className={styles.fullInfo}>
                            <FullInfoField fieldName={'Delivery city name'} fieldValue={deliveryCity.name} />

                            <div className={styles.fullInfo__buttons}>
                                <button
                                    className={styles.fullInfo__removeButton}
                                    onClick={() => {
                                        setConfirmationModalMessage(<span>Are you sure you want to delete the delivery city {deliveryCity.name}?</span>);
                                        setConfirmationModalCallback(() => () => removeAndShowCity(deliveryCity.id));
                                        setIsConfirmationModalVisible(true);
                                    }}
                                >
                                    Delete
                                </button>
                                <button
                                    className={styles.fullInfo__editButton}
                                    onClick={() => setIsCityChanging(!isCityChanging)}
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

export default AdminDeliveryCity;