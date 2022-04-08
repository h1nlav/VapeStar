import React from 'react';
import AdminAddDeliveryDepartment from '../AdminAddDeliveryDepartment/AdminAddDeliveryDepartment';
import AdminDeliveryDepartment from '../AdminDeliveryDepartment/AdminDeliveryDepartment';
import styles from './AdminDeliveryDepartmentsList.module.css';

const AdminDeliveryDepartmentsList = ({ deliveryDepartments, deliveryDepartmentsCount,
    deliveryCities, deliveryCompanies, fetchAndShowDeliveryInfo, isRequiringChange = false }) => {


    return (
        <ul className={styles.deliveryDepartmentsList}>
            <div className={styles.deliveryDepartmentsList__name}>
                <h1>{!isRequiringChange ? 'Delivery departments' : 'Departments requiring changes'}</h1>
            </div>
            <div className={styles.deliveryDepartmentsList__count}>
                <span>{!isRequiringChange
                    ? `Total number of delivery departments: ${deliveryDepartmentsCount}`
                    : `Total number of delivery departments requiring changes: ${deliveryDepartmentsCount}`
                }</span>
            </div>

            {deliveryDepartments.map(deliveryDepartment =>
                <AdminDeliveryDepartment
                    key={deliveryDepartment.id}
                    deliveryDepartment={deliveryDepartment}
                    deliveryCities={deliveryCities}
                    deliveryCompanies={deliveryCompanies}
                    fetchAndShowDeliveryInfo={fetchAndShowDeliveryInfo}
                />
            )}

            {!isRequiringChange &&
                <AdminAddDeliveryDepartment deliveryCities={deliveryCities} deliveryCompanies={deliveryCompanies} fetchAndShowDeliveryInfo={fetchAndShowDeliveryInfo} />
            }
        </ul>
    );
};

export default AdminDeliveryDepartmentsList;