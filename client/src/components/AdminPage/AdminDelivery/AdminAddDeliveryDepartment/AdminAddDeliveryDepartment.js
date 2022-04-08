import React, { useState } from 'react';
import AdminChangeDeliveryDepartment from '../AdminChangeDeliveryDepartment/AdminChangeDeliveryDepartment';
import styles from './AdminAddDeliveryDepartment.module.css';

const AdminAddDeliveryDepartment = ({ deliveryCities, deliveryCompanies, fetchAndShowDeliveryInfo }) => {
    const [isNewDeliveryCompanyCreating, setIsNewDeliveryCompanyCreating] = useState(false);

    return (
        <div>
            {isNewDeliveryCompanyCreating
                ?
                <div className={styles.addDeliveryDepartmentForm}>
                    <AdminChangeDeliveryDepartment
                        isCreating={true}
                        deliveryDepartment={{
                            name: '',
                            adress: '',
                            deliveryCityId: 0,
                            deliveryCompanyId: 0
                        }}
                        deliveryCities={deliveryCities}
                        deliveryCompanies={deliveryCompanies}
                        fetchAndShowDeliveryInfo={fetchAndShowDeliveryInfo}
                        setIsDepartmentChanging={setIsNewDeliveryCompanyCreating}
                    />
                </div>
                :
                <div
                    className={styles.addDeliveryDepartmentForm_addDepartmentButton}
                    onClick={() => setIsNewDeliveryCompanyCreating(true)}
                >
                    <span>Add delivery department</span>
                </div>
            }
        </div>
    );
};

export default AdminAddDeliveryDepartment;