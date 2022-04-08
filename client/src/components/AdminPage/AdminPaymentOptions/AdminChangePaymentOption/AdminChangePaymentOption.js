import React, { useState } from 'react';
import { createPaymentOption, updatePaymentOption } from '../../../../api/deliveryApi';
import ChangeFullInfoField from '../../../UI/ChangeFullInfoField/ChangeFullInfoField';
import styles from './AdminChangePaymentOption.module.css';

const AdminChangePaymentOption = ({ isCreating = false, paymentOption, fetchAndShowPaymentOptions, setIsPaymentOptionChanging }) => {
    const [paymentOptionNameValue, setPaymentOptionNameValue] = useState(paymentOption.name);

    const changeAndShowPaymentOption = async () => {
        if (paymentOptionNameValue.length !== 0) {
            if (isCreating) {
                await createPaymentOption({ name: paymentOptionNameValue })
                    .then(async () => {
                        await fetchAndShowPaymentOptions();
                        setIsPaymentOptionChanging(false);
                    })
            } else {
                await updatePaymentOption({ id: paymentOption.id, name: paymentOptionNameValue })
                    .then(async () => {
                        await fetchAndShowPaymentOptions();
                        setIsPaymentOptionChanging(false);
                    })
            }
        }
    }

    return (
        <div className={styles.changePaymentOption}>
            <ChangeFullInfoField name={'Payment method name'} value={paymentOptionNameValue} setValue={(value) => setPaymentOptionNameValue(value)} checkArray={[]} />

            <div className={styles.changePaymentOption__buttons}>
                <button
                    className={paymentOptionNameValue.length === 0
                        ? `${styles.changePaymentOption__saveButton} ${styles.changePaymentOption__saveButtonNotActive}`
                        : styles.changePaymentOption__saveButton
                    }
                    onClick={() => changeAndShowPaymentOption()}
                >
                    Save
                </button>
                <button
                    className={styles.changePaymentOption__cancelButton}
                    onClick={() => setIsPaymentOptionChanging(false)}
                >
                    Cancel
                </button>
            </div>
        </div>
    );
};

export default AdminChangePaymentOption;