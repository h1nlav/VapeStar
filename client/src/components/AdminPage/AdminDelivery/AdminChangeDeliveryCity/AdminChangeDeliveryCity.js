import React, { useState } from 'react';
import { createDeliveryCity, updateDeliveryCity } from '../../../../api/deliveryApi';
import ChangeFullInfoField from '../../../UI/ChangeFullInfoField/ChangeFullInfoField';
import styles from './AdminChangeDeliveryCity.module.css'

const AdminChangeDeliveryCity = ({ isCreating = false, deliveryCity, fetchAndShowDeliveryInfo, setIsCityChanging }) => {

    const [deliveryCityNameValue, setDeliveryCityNameValue] = useState(deliveryCity.name);

    const changeAndShowDeliveryCity = async () => {
        if (deliveryCityNameValue !== '') {
            if (isCreating) {
                await createDeliveryCity({ name: deliveryCityNameValue })
                    .then(async () => {
                        setIsCityChanging(false);
                        await fetchAndShowDeliveryInfo();
                    });
            } else {
                await updateDeliveryCity({ id: deliveryCity.id, name: deliveryCityNameValue })
                    .then(async () => {
                        setIsCityChanging(false);
                        await fetchAndShowDeliveryInfo();
                    });
            }
        }
    }


    return (
        <div className={styles.changeDeliveryCityForm}>
            <ChangeFullInfoField name={'Delivery city name'} value={deliveryCityNameValue} setValue={(value) => setDeliveryCityNameValue(value)} checkArray={[]} />

            <div className={styles.changeDeliveryCityForm__buttons}>
                <button
                    className={deliveryCityNameValue === ''
                        ? `${styles.changeDeliveryCityForm__saveButton} ${styles.changeDeliveryCityForm__saveButtonNotActive}`
                        : styles.changeDeliveryCityForm__saveButton
                    }
                    onClick={() => changeAndShowDeliveryCity()}
                >
                    Save
                </button>
                <button
                    className={styles.changeDeliveryCityForm__cancelButton}
                    onClick={() => setIsCityChanging(false)}
                >
                    Cancel
                </button>
            </div>
        </div>
    );
};

export default AdminChangeDeliveryCity;