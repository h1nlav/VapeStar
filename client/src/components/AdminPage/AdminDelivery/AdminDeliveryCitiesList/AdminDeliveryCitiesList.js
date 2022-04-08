import React from 'react';
import AdminAddDeliveryCity from '../AdminAddDeliveryCity/AdminAddDeliveryCity';
import AdminDeliveryCity from '../AdminDeliveryCity/AdminDeliveryCity';
import styles from './AdminDeliveryCitiesList.module.css';

const AdminDeliveryCitiesList = ({ deliveryCities, deliveryCitiesCount, fetchAndShowDeliveryInfo }) => {
    return (
        <ul className={styles.deliveryCitiesList}>
            <div className={styles.deliveryCitiesList__name}>
                <h1>Delivery cities</h1>
            </div>
            <div className={styles.deliveryCitiesList__count}>
                <span>Total number of delivery cities: {deliveryCitiesCount}</span>
            </div>

            {deliveryCities.map(deliveryCity =>
                <AdminDeliveryCity key={deliveryCity.id} deliveryCity={deliveryCity} fetchAndShowDeliveryInfo={fetchAndShowDeliveryInfo} />
            )}

            <AdminAddDeliveryCity fetchAndShowDeliveryInfo={fetchAndShowDeliveryInfo} />
        </ul>
    );
};

export default AdminDeliveryCitiesList;