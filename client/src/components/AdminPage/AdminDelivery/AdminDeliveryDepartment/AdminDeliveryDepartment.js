import React, { useState } from 'react';
import { deleteDeliveryDepartment } from '../../../../api/deliveryApi';
import ConfirmationModal from '../../../UI/ConfirmationModal/ConfirmationModal';
import FullInfoField from '../../../UI/FullInfoField/FullInfoField';
import ShortInfoContainer from '../../../UI/ShortInfoContainer/ShortInfoContainer';
import AdminChangeDeliveryDepartment from '../AdminChangeDeliveryDepartment/AdminChangeDeliveryDepartment';
import styles from './AdminDeliveryDepartment.module.css';

const AdminDeliveryDepartment = ({ deliveryDepartment, deliveryCities, deliveryCompanies, fetchAndShowDeliveryInfo }) => {
    const [isDepartmentOpened, setIsDepartmentOpened] = useState(false);
    const [isDepartmentChanging, setIsDepartmentChanging] = useState(false);

    const [isConfirmationModalVisible, setIsConfirmationModalVisible] = useState(false);
    const [confirmationModalMessage, setConfirmationModalMessage] = useState('');
    const [confirmationModalCallback, setConfirmationModalCallback] = useState(null);

    const removeAndShowDepartment = async (id) => {
        await deleteDeliveryDepartment({ id })
            .then(async () => {
                await fetchAndShowDeliveryInfo();
            })
    }

    return (
        <li className={styles.deliveryDepartment}>
            <ShortInfoContainer
                id={`№ ${deliveryDepartment.id}`}
                isOpened={isDepartmentOpened}
                onClick={() => setIsDepartmentOpened(!isDepartmentOpened)}
            >
                <div className={styles.shortInfo__name}>{deliveryDepartment.name}</div>
                <div className={styles.shortInfo__company}>{deliveryCompanies.map(deliveryCompany => deliveryCompany.id === deliveryDepartment.deliveryCompanyId && deliveryCompany.name)}</div>
                <div className={styles.shortInfo__city}>{deliveryCities.map(deliveryCity => deliveryCity.id === deliveryDepartment.deliveryCityId && deliveryCity.name)}</div>
            </ShortInfoContainer>

            {isDepartmentOpened &&
                <div className={styles.deliveryDepartment__opened}>
                    {isDepartmentChanging
                        ?
                        <AdminChangeDeliveryDepartment
                            deliveryDepartment={deliveryDepartment}
                            deliveryCities={deliveryCities}
                            deliveryCompanies={deliveryCompanies}
                            fetchAndShowDeliveryInfo={fetchAndShowDeliveryInfo}
                            setIsDepartmentChanging={setIsDepartmentChanging}
                        />
                        :
                        <div className={styles.fullInfo}>
                            <FullInfoField fieldName={'Department name'} fieldValue={deliveryDepartment.name} />

                            <FullInfoField fieldName={'Company'} fieldValue={function () {
                                let name = null;
                                deliveryCompanies.map(deliveryCompany => {
                                    if (deliveryCompany.id === deliveryDepartment.deliveryCompanyId) name = deliveryCompany.name;
                                });
                                return name ? name : 'You must select a company!';
                            }()} />

                            <FullInfoField fieldName={'City'} fieldValue={function () {
                                let name = null;
                                deliveryCities.map(deliveryCity => {
                                    if (deliveryCity.id === deliveryDepartment.deliveryCityId) name = deliveryCity.name;
                                });
                                return name ? name : 'You must select a city!';
                            }()} />

                            <FullInfoField fieldName={'Department address'} fieldValue={deliveryDepartment.adress} />

                            <div className={styles.fullInfo__buttons}>
                                <button
                                    className={styles.fullInfo__removeButton}
                                    onClick={() => {
                                        setConfirmationModalMessage(<span>Are you sure you want to delete delivery department {deliveryDepartment.name}?</span>);
                                        setConfirmationModalCallback(() => () => removeAndShowDepartment(deliveryDepartment.id));
                                        setIsConfirmationModalVisible(true);
                                    }}
                                >
                                    Delete
                                </button>
                                <button
                                    className={styles.fullInfo__editButton}
                                    onClick={() => setIsDepartmentChanging(!isDepartmentChanging)}
                                >
                                    Edit
                                </button>
                            </div>
                        </div>
                    }
                </div>
            }
            <ConfirmationModal
                isVisible={isConfirmationModalVisible}
                setIsVisible={setIsConfirmationModalVisible}
                message={confirmationModalMessage}
                callback={confirmationModalCallback}
            />
        </li>
    );
};

export default AdminDeliveryDepartment;