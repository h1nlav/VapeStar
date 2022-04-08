import React, { useState } from 'react';
import { createDeliveryDepartment, updateDeliveryDepartment } from '../../../../api/deliveryApi';
import ChangeFullInfoField from '../../../UI/ChangeFullInfoField/ChangeFullInfoField';
import styles from './AdminChangeDeliveryDepartment.module.css';

const AdminChangeDeliveryDepartment = ({ isCreating = false, deliveryDepartment, deliveryCities, deliveryCompanies, fetchAndShowDeliveryInfo, setIsDepartmentChanging }) => {
    const [deliveryDepartmentNameValue, setDeliveryDepartmentNameValue] = useState(deliveryDepartment.name);
    const [deliveryDepartmentAdressValue, setDeliveryDepartmentAdressValue] = useState(deliveryDepartment.adress);
    const [deliveryDepartmentCityId, setDeliveryDepartmentCityId] = useState(deliveryDepartment.deliveryCityId || 0);
    const [deliveryDepartmentCompanyId, setDeliveryDepartmentCompanyId] = useState(deliveryDepartment.deliveryCompanyId || 0);

    const changeAndShowDeliveryDepartment = async () => {
        if (deliveryDepartmentNameValue !== ''
            && deliveryDepartmentAdressValue !== ''
            && deliveryDepartmentCityId !== 0
            && deliveryDepartmentCompanyId !== 0
        ) {
            if (isCreating) {
                await createDeliveryDepartment({
                    name: deliveryDepartmentNameValue,
                    adress: deliveryDepartmentAdressValue,
                    deliveryCityId: deliveryDepartmentCityId,
                    deliveryCompanyId: deliveryDepartmentCompanyId
                }).then(async () => {
                    setIsDepartmentChanging(false);
                    await fetchAndShowDeliveryInfo();
                });
            } else {
                await updateDeliveryDepartment({
                    id: deliveryDepartment.id,
                    name: deliveryDepartmentNameValue,
                    adress: deliveryDepartmentAdressValue,
                    deliveryCityId: deliveryDepartmentCityId,
                    deliveryCompanyId: deliveryDepartmentCompanyId
                })
                    .then(async () => {
                        setIsDepartmentChanging(false);
                        await fetchAndShowDeliveryInfo();
                    });
            }
        }
    }

    return (
        <div className={styles.changeDeliveryDepartmentsForm}>
            <ChangeFullInfoField name={'Department name'} value={deliveryDepartmentNameValue} setValue={(value) => setDeliveryDepartmentNameValue(value)} checkArray={[]} />

            <div className={styles.changeDeliveryDepartmentsForm__field}>
                <div className={styles.changeDeliveryDepartmentsForm__label}><span>Company</span></div>
                <select
                    className={styles.changeDeliveryDepartmentsForm__select}
                    value={deliveryDepartmentCompanyId}
                    onInput={e => setDeliveryDepartmentCompanyId(e.target.value)}
                >
                    {deliveryDepartmentCompanyId === 0 && <option value={0}></option>}
                    {deliveryCompanies.map(company =>
                        <option key={company.id} value={company.id}>{company.name}</option>
                    )}
                </select>
            </div>

            <div className={styles.changeDeliveryDepartmentsForm__field}>
                <div className={styles.changeDeliveryDepartmentsForm__label}><span>City</span></div>
                <select
                    className={styles.changeDeliveryDepartmentsForm__select}
                    value={deliveryDepartmentCityId}
                    onInput={e => setDeliveryDepartmentCityId(e.target.value)}
                >
                    {deliveryDepartmentCityId === 0 && <option value={0}></option>}

                    {deliveryCities.map(city =>
                        <option key={city.id} value={city.id}>{city.name}</option>
                    )}
                </select>
            </div>

            <ChangeFullInfoField name={'Department address'} value={deliveryDepartmentAdressValue} setValue={(value) => setDeliveryDepartmentAdressValue(value)} checkArray={[]} />

            <div className={styles.changeDeliveryDepartmentsForm__buttons}>
                <button
                    className={function () {
                        if (deliveryDepartmentNameValue == '' || deliveryDepartmentAdressValue == ''
                            || deliveryDepartmentCityId == 0 || deliveryDepartmentCompanyId == 0) {
                            return `${styles.changeDeliveryDepartmentsForm__saveButton} ${styles.changeDeliveryDepartmentsForm__saveButtonNotActive}`
                        } else {
                            return styles.changeDeliveryDepartmentsForm__saveButton;
                        }
                    }()}
                    onClick={() => changeAndShowDeliveryDepartment()}
                >
                    Save
                </button>
                <button
                    className={styles.changeDeliveryDepartmentsForm__cancelButton}
                    onClick={() => setIsDepartmentChanging(false)}
                >
                    Cancel
                </button>
            </div>
        </div>
    );
};


export default AdminChangeDeliveryDepartment;