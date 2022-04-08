import React from 'react';
import AdminAddOrderStatus from '../AdminAddOrderStatus/AdminAddOrderStatus';
import AdminOrderStatus from '../AdminOrderStatus/AdminOrderStatus';
import styles from './AdminOrdersStatusesList.module.css';

const AdminOrdersStatusesList = ({ statuses, fetchAndShowOrders }) => {

    return (
        <ul className={styles.statusesList}>
            <div className={styles.statusesList__name}>
                <h1>Order statuses</h1>
            </div>

            {statuses.map(status =>
                <AdminOrderStatus key={status.id} status={status} fetchAndShowOrders={fetchAndShowOrders} />
            )}
            <AdminAddOrderStatus fetchAndShowOrders={fetchAndShowOrders} />
        </ul>
    );
};

export default AdminOrdersStatusesList;