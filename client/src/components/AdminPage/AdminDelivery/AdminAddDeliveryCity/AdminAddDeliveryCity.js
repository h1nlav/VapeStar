import React, { useState } from 'react';
import { createDeliveryCity } from '../../../../api/deliveryApi';
import AdminChangeDeliveryCity from '../AdminChangeDeliveryCity/AdminChangeDeliveryCity';
import styles from './AdminAddDeliveryCity.module.css';

const AdminAddDeliveryCity = ({ fetchAndShowDeliveryInfo }) => {
    const [isNewDeliveryCityCreating, setIsNewDeliveryCityCreating] = useState(false);

    return (
        <div>
            {isNewDeliveryCityCreating
                ?
                <div className={styles.addDeliveryCityForm}>
                    <AdminChangeDeliveryCity
                        isCreating={true}
                        deliveryCity={{ name: '' }}
                        fetchAndShowDeliveryInfo={fetchAndShowDeliveryInfo}
                        setIsCityChanging={setIsNewDeliveryCityCreating}
                    />
                </div>
                :
                <div
                    className={styles.addDeliveryCityForm_addCategoryButton}
                    onClick={() => setIsNewDeliveryCityCreating(true)}
                >
                    <span>Add delivery city</span>
                </div>
            }
        </div>
    );
};

export default AdminAddDeliveryCity;