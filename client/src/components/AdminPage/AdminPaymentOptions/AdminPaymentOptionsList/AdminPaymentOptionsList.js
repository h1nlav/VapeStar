import React, { useEffect, useState } from 'react';
import { getAllPaymentOptions } from '../../../../api/deliveryApi';
import AdminAddPaymentOption from '../AdminAddPaymentOption/AdminAddPaymentOption';
import AdminPaymentOption from '../AdminPaymentOption/AdminPaymentOption';
import styles from './AdminPaymentOptionsList.module.css';

const AdminPaymentOptionsList = () => {
    const [paymentOptions, setPaymentOptions] = useState([]);

    useEffect(() => fetchAndShowPaymentOptions(), []);

    const fetchAndShowPaymentOptions = async () => {
        await getAllPaymentOptions()
            .then(data => {
                data && setPaymentOptions(data);
            });
    }

    return (
        <ul className={styles.paymentOptionsList}>
            <div className={styles.paymentOptionsList__name}>
                <h1>Payment methods</h1>
            </div>

            {paymentOptions.map(paymentOption =>
                <AdminPaymentOption
                    key={paymentOption.id}
                    paymentOption={paymentOption}
                    fetchAndShowPaymentOptions={fetchAndShowPaymentOptions}
                />
            )}

            <AdminAddPaymentOption fetchAndShowPaymentOptions={fetchAndShowPaymentOptions} />
        </ul>
    );
};

export default AdminPaymentOptionsList;