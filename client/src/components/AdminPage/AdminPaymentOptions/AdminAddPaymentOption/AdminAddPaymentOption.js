import React, { useState } from 'react';
import { createPaymentOption } from '../../../../api/deliveryApi';
import AdminChangePaymentOption from '../AdminChangePaymentOption/AdminChangePaymentOption';
import styles from './AdminAddPaymentOption.module.css';

const AdminAddPaymentOption = ({ fetchAndShowPaymentOptions }) => {
    const [isNewPaymentOptionCreating, setIsNewPaymentOptionCreating] = useState(false);

    return (
        <div>
            {isNewPaymentOptionCreating
                ?
                <div className={styles.addPaymentOption}>
                    <AdminChangePaymentOption
                        isCreating={true}
                        paymentOption={{ name: '' }}
                        fetchAndShowPaymentOptions={fetchAndShowPaymentOptions}
                        setIsPaymentOptionChanging={setIsNewPaymentOptionCreating}
                    />
                </div>
                :
                <div
                    className={styles.addPaymentOption_addPaymentOptionButton}
                    onClick={() => setIsNewPaymentOptionCreating(true)}
                >
                    <span>Add payment method</span>
                </div>
            }
        </div>
    );
};

export default AdminAddPaymentOption;