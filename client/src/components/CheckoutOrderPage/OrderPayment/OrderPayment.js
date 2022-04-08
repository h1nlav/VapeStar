import { observer } from 'mobx-react-lite';
import React, { useContext, useEffect, useState } from 'react';
import { Context } from '../../..';
import styles from './OrderPayment.module.css';

const OrderPayment = observer(({ paymentOptions }) => {

    const { order } = useContext(Context);

    return (
        <div className={styles.payment}>
            <div className={styles.payment__sectionNumber}>4</div>
            <div className={styles.payment__content}>
                <span className={styles.payment__name}>Payment method</span>
                
                {paymentOptions.map(option =>
                    < div
                        key={option.id}
                        className={option.id === order.paymentOption
                            ? `${styles.payment__field} ${styles.payment__selectedField}`
                            : styles.payment__field
                        }
                        onClick={() => order.setPaymentOption(option.id)}
                    >
                        <input
                            type='radio'
                            checked={option.id === order.paymentOption}
                            onChange={() => order.setPaymentOption(option.id)}
                        />
                        <label>{option.name}</label>
                    </div>
                )}
            </div>
        </div >
    );
});

export default OrderPayment;