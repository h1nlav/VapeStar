import React from 'react';
import AdminAddDeliveryCompany from '../AdminAddDeliveryCompany/AdminAddDeliveryCompany';
import AdminDeliveryCompany from '../AdminDeliveryCompany/AdminDeliveryCompany';
import styles from './AdminDeliveryCompaniesList.module.css';

const AdminDeliveryCompaniesList = ({ deliveryCompanies, deliveryCompaniesCount, fetchAndShowDeliveryInfo }) => {
    return (
        <ul className={styles.deliveryCategoriesList}>
            <div className={styles.deliveryCategoriesList__name}>
                <h1>Delivery services</h1>
            </div>
            <div className={styles.deliveryCategoriesList__count}>
                <span>Total number of delivery services: {deliveryCompaniesCount}</span>
            </div>

            {deliveryCompanies.map(deliveryCompany =>
                <AdminDeliveryCompany key={deliveryCompany.id} deliveryCompany={deliveryCompany} fetchAndShowDeliveryInfo={fetchAndShowDeliveryInfo} />
            )}

            <AdminAddDeliveryCompany fetchAndShowDeliveryInfo={fetchAndShowDeliveryInfo} />
        </ul>
    );
};

export default AdminDeliveryCompaniesList;