import React, { useState } from 'react';
import { createStatus } from '../../../../api/orderApi';
import AdminChangeOrderStatus from '../AdminChangeOrderStatus/AdminChangeOrderStatus';
import styles from './AdminAddOrderStatus.module.css';

const AdminAddOrderStatus = ({ fetchAndShowOrders }) => {
    const [isNewStatusCreating, setIsNewStatusCreating] = useState(false);

    return (
        <div>
            {isNewStatusCreating
                ?
                <div className={styles.addStatus}>
                    <AdminChangeOrderStatus
                        status={{ name: '', color: '' }}
                        fetchAndShowOrders={fetchAndShowOrders}
                        setIsStatusChanging={() => setIsNewStatusCreating(false)}
                        isCreating={true}
                    />
                </div>
                :
                <div
                    className={styles.addStatus_addStatusButton}
                    onClick={() => setIsNewStatusCreating(true)}
                >
                    <span>Add status</span>
                </div>
            }
        </div >
    );
};

export default AdminAddOrderStatus;