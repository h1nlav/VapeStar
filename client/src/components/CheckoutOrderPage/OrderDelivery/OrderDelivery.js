import { observer } from 'mobx-react-lite';
import React, { useContext } from 'react';
import { Context } from '../../..';
import { sortedKeys } from '../../../utils/sortedKeys';
import AlertsList from '../../UI/AlertsList/AlertsList';
import styles from './OrderDelivery.module.css';

const OrderDelivery = observer(({ deliveryInfo }) => {
    const { order } = useContext(Context);

    if (deliveryInfo.length == 0) return (<div></div>);
    return (
        <div className={styles.delivery}>
            <div className={styles.delivery__sectionNumber}>3</div>

            <div className={styles.delivery__content}>
                <span className={styles.delivery__name}>Delivery</span>

                <div className={styles.delivery__field}>
                    <div className={styles.delivery__label}><span>Delivery service</span></div>
                    <select
                        className={styles.delivery__select}
                        value={order.selectedCompany}
                        onInput={e => {
                            order.setSelectedCompany(e.target.value);
                            order.setSelectedCompanyCheck();
                            order.setSelectedCity(0);
                            order.setSelectedCityCheck();
                            order.setSelectedDepartment(0);
                            order.setSelectedDepartmentCheck();
                        }}
                    >
                        {order.selectedCompany === 0 && <option value={0}></option>}
                        {sortedKeys(deliveryInfo).map(companyKey =>
                            <option key={companyKey} value={companyKey}>{deliveryInfo[companyKey].companyName}</option>
                        )}
                    </select>
                    <AlertsList checkArray={order.selectedCompanyCheck} />
                </div>

                {order.selectedCompany !== 0 &&
                    <div className={styles.delivery__field}>
                        <div className={styles.delivery__label}><span>City</span></div>
                        <select
                            className={styles.delivery__select}
                            value={order.selectedCity}
                            onInput={e => {
                                order.setSelectedCity(e.target.value);
                                order.setSelectedCityCheck();
                                order.setSelectedDepartment(0);
                                order.setSelectedDepartmentCheck();
                            }}
                        >
                            {order.selectedCity === 0 && <option value={0}></option>}
                            {sortedKeys(deliveryInfo[order.selectedCompany].cities).map(cityKey =>
                                <option key={cityKey} value={cityKey}>{deliveryInfo[order.selectedCompany].cities[cityKey].cityName}</option>
                            )}
                        </select>
                        <AlertsList checkArray={order.selectedCityCheck} />
                    </div>
                }

                {order.selectedCompany !== 0 && order.selectedCity !== 0 &&
                    <div className={styles.delivery__field}>
                        <div className={styles.delivery__label}><span>Delivery department</span></div>
                        <select
                            className={styles.delivery__select}
                            value={order.selectedDepartment}
                            onInput={e => {
                                order.setSelectedDepartment(e.target.value);
                                order.setSelectedDepartmentCheck();
                            }}
                        >
                            {order.selectedDepartment === 0 && <option value={0}></option>}
                            {sortedKeys(deliveryInfo[order.selectedCompany].cities[order.selectedCity].departments).map(departmentKey =>
                                <option key={departmentKey} value={departmentKey}>
                                    {deliveryInfo[order.selectedCompany].cities[order.selectedCity].departments[departmentKey].name}.
                                    {deliveryInfo[order.selectedCompany].cities[order.selectedCity].departments[departmentKey].adress}
                                </option>
                            )}
                        </select>
                        <AlertsList checkArray={order.selectedDepartmentCheck} />
                    </div>
                }
            </div>
        </div >
    );
});

export default OrderDelivery;