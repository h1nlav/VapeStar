import { observer } from 'mobx-react-lite';
import React, { useContext, useEffect, useState } from 'react';
import { Context } from '../../../..';
import { getOrdersById } from '../../../../api/orderApi';
import UserOrder from '../UserOrder/UserOrder';
import styles from './UserOrdersList.module.css';

const UserOrdersList = observer(() => {
    const { auth } = useContext(Context);
    const [isOrdersLoading, setIsOrdersLoading] = useState(true);
    const [orders, setOrders] = useState([]);

    useEffect(async () => {
        setIsOrdersLoading(true);
        await getOrdersById({ userId: auth.user.id })
            .then(data => setOrders(data));
        setIsOrdersLoading(false);
    }, [auth.user]);

    return (
        <ul className={styles.ordersList}>
            <div className={styles.ordersList__name}>
                <h1>My orders</h1>
            </div>

            {!isOrdersLoading && orders.length === 0 &&
                <div className={styles.ordersList__notfound}>
                    <span>You haven't ordered from our store yet :(</span>
                </div>
            }
            
            {orders.map(order =>
                <UserOrder key={order.id} order={order} />
            )}
        </ul>
    );
});

export default UserOrdersList;