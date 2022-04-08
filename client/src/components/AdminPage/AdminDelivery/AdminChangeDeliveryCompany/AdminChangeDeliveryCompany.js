import React, { useState } from 'react';
import { createDeliveryCompany, updateDeliveryCompany } from '../../../../api/deliveryApi';
import ChangeFullInfoField from '../../../UI/ChangeFullInfoField/ChangeFullInfoField';
import styles from './AdminChangeDeliveryCompany.module.css'

const AdminChangeDeliveryCompany = ({ isCreating = false, deliveryCompany, fetchAndShowDeliveryInfo, setIsCompanyChanging }) => {
    const [deliveryCompanyNameValue, setDeliveryCompanyNameValue] = useState(deliveryCompany.name);

    const changeAndShowDeliveryCompany = async () => {
        if (deliveryCompanyNameValue !== '') {
            if (isCreating) {
                await createDeliveryCompany({ name: deliveryCompanyNameValue })
                    .then(async () => {
                        setIsCompanyChanging(false);
                        await fetchAndShowDeliveryInfo();
                    });
            } else {
                await updateDeliveryCompany({ id: deliveryCompany.id, name: deliveryCompanyNameValue })
                    .then(async () => {
                        setIsCompanyChanging(false);
                        await fetchAndShowDeliveryInfo();
                    });
            }
        }
    }

    return (
        <div className={styles.changeDeliveryCompanyForm}>
            <ChangeFullInfoField name={'Delivery service name'} value={deliveryCompanyNameValue} setValue={(value) => setDeliveryCompanyNameValue(value)} checkArray={[]} />

            <div className={styles.changeDeliveryCompanyForm__buttons}>
                <button
                    className={deliveryCompanyNameValue === ''
                        ? `${styles.changeDeliveryCompanyForm__saveButton} ${styles.changeDeliveryCompanyForm__saveButtonNotActive}`
                        : styles.changeDeliveryCompanyForm__saveButton
                    }
                    onClick={() => changeAndShowDeliveryCompany()}
                >
                    Save
                </button>
                <button
                    className={styles.changeDeliveryCompanyForm__cancelButton}
                    onClick={() => setIsCompanyChanging(false)}
                >
                    Cancel
                </button>
            </div>
        </div>
    );
};

export default AdminChangeDeliveryCompany;