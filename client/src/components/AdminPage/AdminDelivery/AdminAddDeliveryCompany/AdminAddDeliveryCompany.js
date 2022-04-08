import React, { useState } from 'react';
import { createDeliveryCompany } from '../../../../api/deliveryApi';
import AdminChangeDeliveryCompany from '../AdminChangeDeliveryCompany/AdminChangeDeliveryCompany';
import styles from './AdminAddDeliveryCompany.module.css';

const AdminAddDeliveryCompany = ({ fetchAndShowDeliveryInfo }) => {

    const [isNewDeliveryCompanyCreating, setIsNewDeliveryCompanyCreating] = useState(false);
    const [newDeliveryCompanyNameValue, setNewDeliveryCompanyNameValue] = useState('');

    const createAndShowDeliveryCompany = async () => {
        if (newDeliveryCompanyNameValue !== '') {
            await createDeliveryCompany({ name: newDeliveryCompanyNameValue })
                .then(async () => {
                    setNewDeliveryCompanyNameValue('');
                    setIsNewDeliveryCompanyCreating(false);
                    await fetchAndShowDeliveryInfo();
                })
        }
    }

    return (
        <div>
            {isNewDeliveryCompanyCreating
                ?
                <div className={styles.addDeliveryCompanyForm}>
                    <AdminChangeDeliveryCompany
                        isCreating={true}
                        deliveryCompany={{ name: '' }}
                        fetchAndShowDeliveryInfo={fetchAndShowDeliveryInfo}
                        setIsCompanyChanging={setIsNewDeliveryCompanyCreating}
                    />
                </div>
                :
                <div
                    className={styles.addDeliveryCompanyForm_addCategoryButton}
                    onClick={() => setIsNewDeliveryCompanyCreating(true)}
                >
                    <span>Add delivery service</span>
                </div>
            }
        </div>
    );
};

export default AdminAddDeliveryCompany;