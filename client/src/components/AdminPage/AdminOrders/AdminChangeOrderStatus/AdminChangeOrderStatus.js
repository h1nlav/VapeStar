import React, { useState } from 'react';
import { createStatus, updateStatus } from '../../../../api/orderApi';
import styles from './AdminChangeOrderStatus.module.css';

const AdminChangeOrderStatus = ({ status, fetchAndShowOrders, setIsStatusChanging, isCreating = false }) => {
    const [statusNameValue, setStatusNameValue] = useState(status.name);
    const [statusColorValue, setStatusColorValue] = useState(status.color);

    const changeAndShowOrderStatus = async () => {

        if (statusNameValue.length !== 0 && statusColorValue.length !== 0) {
            if (isCreating) {
                await createStatus({
                    name: statusNameValue,
                    color: statusColorValue,
                }).then(async () => {
                    await fetchAndShowOrders();
                    setIsStatusChanging(false);
                })
            }
            await updateStatus({ id: status.id, name: statusNameValue, color: statusColorValue })
                .then(async () => {
                    await fetchAndShowOrders();
                    setIsStatusChanging(false);
                })
        }
    }

    return (
        <div className={styles.changeInfo}>
            <div className={styles.changeInfo__flex}>
                <div className={styles.changeInfo__flexField}>
                    <div className={styles.changeInfo__field}>
                        <div className={styles.changeInfo__label}><span>Status name</span></div>
                        {status.id !== 1
                            ?
                            <input
                                className={styles.changeInfo__input}
                                value={statusNameValue || ''}
                                onChange={e => setStatusNameValue(e.target.value)}
                            />
                            :
                            <span className={styles.fullInfo__value}>{status.name}</span>
                        }
                    </div>
                    <div className={styles.changeInfo__field}>
                        <div className={styles.changeInfo__label}><span>Status color</span></div>
                        <input
                            className={styles.changeInfo__input}
                            onChange={e => {
                                let reg = /^#([0-9a-f]{3}){1,2}$/i;
                                if (reg.test(e.target.value) && reg.test(e.target.value)) setStatusColorValue(e.target.value);
                                else setStatusColorValue('');

                            }}
                        />
                    </div>
                </div>
                <div className={styles.changeInfo__flexField}>
                    <div
                        className={styles.colorExample}
                        style={{ background: `${statusColorValue}` }}
                    >
                        <span>{statusNameValue}</span>
                    </div>
                </div>
            </div>

            <div className={styles.changeInfo__buttons}>
                <button
                    className={(statusNameValue.length === 0 || statusColorValue.length === 0)
                        ? `${styles.changeInfo__saveButton} ${styles.changeInfo__saveButtonNotActive}`
                        : styles.changeInfo__saveButton
                    }
                    onClick={() => changeAndShowOrderStatus()}
                >
                    Save
                </button>
                <button
                    className={styles.changeInfo__cancelButton}
                    onClick={() => setIsStatusChanging(false)}
                >
                    Cancel
                </button>
            </div>
        </div>
    );
};

export default AdminChangeOrderStatus;