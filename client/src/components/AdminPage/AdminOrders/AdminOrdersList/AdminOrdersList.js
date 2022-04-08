import React from 'react';
import AdminOrder from '../AdminOrder/AdminOrder';
import styles from './AdminOrdersList.module.css';

const AdminOrdersList = ({ orders, fetchAndShowOrders, statuses, deliveryInfo, paymentOptions }) => {

    return (
        <ul className={styles.ordersList}>
            <div className={styles.ordersList__name}>
                <h1>Orders</h1>
            </div>

            {orders.map(order =>
                <AdminOrder
                    key={order.id}
                    order={order}
                    fetchAndShowOrders={fetchAndShowOrders}
                    statuses={statuses}
                    deliveryInfo={deliveryInfo}
                    paymentOptions={paymentOptions}
                />
            )}
        </ul>
    );
};

export default AdminOrdersList;