import { observer } from 'mobx-react-lite';
import React, { useState } from 'react';
import { IMaskInput } from 'react-imask';
import { Link } from 'react-router-dom';
import { updateOrder } from '../../../../api/orderApi';
import { PRODUCT_ROUTE } from '../../../../router/consts';
import OrderProduct from '../../../CheckoutOrderPage/OrderProduct/OrderProduct';
import AlertsList from '../../../UI/AlertsList/AlertsList';
import ChangeFullInfoField from '../../../UI/ChangeFullInfoField/ChangeFullInfoField';
import ConfirmationModal from '../../../UI/ConfirmationModal/ConfirmationModal';
import styles from './AdminChangeOrder.module.css';

const AdminChangeOrder = observer(({ order, orderInfo, fetchAndShowOrders, setIsOrderChanging, statuses, deliveryInfo, paymentOptions }) => {

    const [isConfirmationModalVisible, setIsConfirmationModalVisible] = useState(false)
    const [confirmationModalMessage, setConfirmationModalMessage] = useState('')
    const [confirmationModalCallback, setConfirmationModalCallback] = useState(null)

    const sortedKeys = (obj) => {
        return Object.keys(obj)
            .sort(function (a, b) {
                return a.localeCompare(b);
            });
    }

    const changeAndShowCategory = async () => {
        !orderInfo.name && orderInfo.setName('');
        !orderInfo.surname && orderInfo.setSurname('');
        !orderInfo.mobileNum && orderInfo.setMobileNum('');
        !orderInfo.selectedCompany && orderInfo.setSelectedCompanyCheck('Это поле обязательно для заполнения');
        (orderInfo.selectedCompany && !orderInfo.selectedCity) && orderInfo.setSelectedCityCheck('Это поле обязательно для заполнения');
        (orderInfo.selectedCompany && orderInfo.selectedCity && !orderInfo.selectedDepartment) && orderInfo.setSelectedDepartmentCheck('Это поле обязательно для заполнения');
        !orderInfo.paymentOption && orderInfo.setPaymentOptionCheck('Это поле обязательно для заполнения');

        if (orderInfo.nameCheck.length === 0 && orderInfo.surnameCheck.length === 0
            && orderInfo.mobileNumCheck.length === 0 && orderInfo.selectedCompanyCheck.length === 0
            && orderInfo.selectedCityCheck.length === 0 && orderInfo.selectedDepartmentCheck.length === 0
            && orderInfo.paymentOptionCheck.length === 0) {

            let companyName = deliveryInfo[orderInfo.selectedCompany].companyName;
            let cityName = deliveryInfo[orderInfo.selectedCompany].cities[orderInfo.selectedCity].cityName;
            let departmentName = deliveryInfo[orderInfo.selectedCompany].cities[orderInfo.selectedCity].departments[orderInfo.selectedDepartment].name;
            let departmentAdress = deliveryInfo[orderInfo.selectedCompany].cities[orderInfo.selectedCity].departments[orderInfo.selectedDepartment].adress;
            let paymentOptionName;
            Promise.all(paymentOptions.map(paymentOption => {
                if (paymentOption.id === parseInt(orderInfo.paymentOption)) paymentOptionName = paymentOption.name;
            }));

            let normalizedMobileNum = orderInfo.mobileNum;
            if (normalizedMobileNum.startsWith('+')) normalizedMobileNum = normalizedMobileNum.split('+').pop();
            if (normalizedMobileNum.startsWith('38')) normalizedMobileNum = normalizedMobileNum.split('38').pop();

            await updateOrder({
                id: order.id,
                name: orderInfo.name,
                surname: orderInfo.surname,
                mobileNum: normalizedMobileNum,
                companyName,
                cityName,
                departmentName: `${departmentName}. ${departmentAdress}`,
                paymentOptionName,
                ordersStatusId: orderInfo.orderStatus,
                deliveryDepartmentId: orderInfo.selectedDepartment,
                paymentOptionId: orderInfo.paymentOption,
                cart: orderInfo.cart,
            }).then(() => {
                fetchAndShowOrders();
                setIsOrderChanging(false);
            })
        }
    }

    return (
        <div className={styles.changeInfo}>

            <div className={styles.changeInfo__fields}>
                <ChangeFullInfoField name={'Customer name'} value={orderInfo.name} setValue={(value) => orderInfo.setName(value)} checkArray={orderInfo.nameCheck} />
                <ChangeFullInfoField name={'Customer surname'} value={orderInfo.surname} setValue={(value) => orderInfo.setSurname(value)} checkArray={orderInfo.surnameCheck} />

                <div className={styles.changeInfo__field}>
                    <div className={styles.changeInfo__label}><span>Customer phone number</span></div>
                    <IMaskInput
                        mask='+[380] 00 000 00 00'
                        className={styles.changeInfo__input}
                        style={orderInfo.mobileNumCheck.length == 0 ? { borderColor: '#a6a5a5' } : { borderColor: '#f84147' }}
                        value={orderInfo.mobileNum}
                        onChange={e => orderInfo.setMobileNum(e.target.value)}
                    />
                    <AlertsList checkArray={orderInfo.mobileNumCheck} />
                </div>
            </div>

            <div className={styles.changeInfo__field}>
                <div className={styles.changeInfo__label}><span>Служба доставки</span></div>
                <select
                    className={styles.changeInfo__select}
                    value={orderInfo.selectedCompany || 0}
                    onInput={e => {
                        orderInfo.setSelectedCompany(e.target.value);
                        orderInfo.setSelectedCompanyCheck();
                        orderInfo.clearSelectedCity();
                        orderInfo.clearSelectedDepartment();
                    }}
                >
                    {!orderInfo.selectedCompany && <option value={0}></option>}
                    {sortedKeys(deliveryInfo).map(companyKey =>
                        <option key={companyKey} value={companyKey}>{deliveryInfo[companyKey].companyName}</option>
                    )}
                </select>
                <AlertsList checkArray={orderInfo.selectedCompanyCheck} />
            </div>

            {orderInfo.selectedCompany &&
                <div className={styles.changeInfo__field}>
                    <div className={styles.changeInfo__label}><span>Город</span></div>
                    <select
                        className={styles.changeInfo__select}
                        value={orderInfo.selectedCity}
                        onInput={e => {
                            orderInfo.setSelectedCity(e.target.value);
                            orderInfo.setSelectedCityCheck();
                            orderInfo.clearSelectedDepartment();
                        }}
                    >
                        {!orderInfo.selectedCity && <option value={0}></option>}
                        {sortedKeys(deliveryInfo[orderInfo.selectedCompany].cities).map(cityKey =>
                            <option key={cityKey} value={cityKey}>{deliveryInfo[orderInfo.selectedCompany].cities[cityKey].cityName}</option>
                        )}
                    </select>
                    <AlertsList checkArray={orderInfo.selectedCityCheck} />
                </div>
            }

            {(!!orderInfo.selectedCompany && !!orderInfo.selectedCity) &&
                <div className={styles.changeInfo__field}>
                    <div className={styles.changeInfo__label}><span>Отделение доставки</span></div>
                    <select
                        className={styles.changeInfo__select}
                        value={orderInfo.selectedDepartment}
                        onInput={e => {
                            orderInfo.setSelectedDepartment(e.target.value);
                            orderInfo.setSelectedDepartmentCheck();
                        }}
                    >
                        {!orderInfo.selectedDepartment && <option value={0}></option>}
                        {sortedKeys(deliveryInfo[orderInfo.selectedCompany].cities[orderInfo.selectedCity].departments).map(departmentKey =>
                            <option key={departmentKey} value={departmentKey}>
                                {deliveryInfo[orderInfo.selectedCompany].cities[orderInfo.selectedCity].departments[departmentKey].name}.
                                {deliveryInfo[orderInfo.selectedCompany].cities[orderInfo.selectedCity].departments[departmentKey].adress}
                            </option>
                        )}
                    </select>
                    <AlertsList checkArray={orderInfo.selectedDepartmentCheck} />
                </div>
            }

            <div className={styles.changeInfo__field}>
                <div className={styles.changeInfo__label}><span>Платежная опция</span></div>
                <select
                    className={styles.changeInfo__select}
                    value={orderInfo.paymentOption}
                    onInput={e => {
                        orderInfo.setPaymentOption(e.target.value);
                        orderInfo.setPaymentOptionCheck();
                    }}
                >
                    {!orderInfo.paymentOption && <option value={0}></option>}
                    {paymentOptions.map(option =>
                        <option key={option.id} value={option.id}>{option.name}</option>
                    )}
                </select>
                <AlertsList checkArray={orderInfo.paymentOptionCheck} />
            </div>

            <div className={styles.productList}>
                <div className={styles.changeInfo__label}><span>Order</span></div>
                <ul className={styles.productList__list}>
                    {orderInfo.cart.map((orderProduct, index) =>
                        <li key={index} className={styles.product}>
                            <div className={styles.product__wrapper}>
                                <div className={styles.product__img}>
                                    <img src={process.env.REACT_APP_API_URL + '/img/' + orderProduct.fileName} />
                                </div>

                                <div className={styles.product__name}>
                                    <Link
                                        to={PRODUCT_ROUTE + '/' + orderProduct.productId}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={styles.product__link}
                                    >
                                        {orderProduct.name}
                                    </Link>
                                </div>
                                <div className={styles.product__fields}>
                                    <div className={styles.product__field}>
                                        <span className={styles.product__fieldLabel}>Price</span>
                                        <span className={styles.product__fieldText}>{orderProduct.price.toLocaleString()} $</span>
                                    </div>
                                    <div className={styles.product__field}>
                                        <span className={styles.product__fieldLabel}>Quantity</span>
                                        <div className={styles.product__inputContainer}>
                                            <div
                                                className={styles.product__inputbutton}
                                                onClick={() => {
                                                    if (orderProduct.quantity > 1) {
                                                        let tmpArr = JSON.parse(JSON.stringify(orderInfo.cart));
                                                        tmpArr[index].quantity = parseInt(tmpArr[index].quantity) - 1
                                                        orderInfo.setCart(tmpArr)
                                                    }
                                                }}
                                            >
                                                <span style={orderProduct.quantity === 1 ? { color: '#d2d2d2' } : { color: '#fe5000' }}>-</span>
                                            </div>
                                            <input
                                                className={styles.product__input}
                                                type='number'
                                                value={orderProduct.quantity}
                                                onChange={e => {
                                                    if (e.target.value >= 1 && e.target.value <= 100) {
                                                        let tmpArr = JSON.parse(JSON.stringify(orderInfo.cart));
                                                        tmpArr[index].quantity = e.target.value
                                                        orderInfo.setCart(tmpArr)
                                                    }
                                                }}
                                            />
                                            <div
                                                className={styles.product__inputbutton}
                                                onClick={() => {
                                                    if (orderProduct.quantity < 99) {
                                                        let tmpArr = JSON.parse(JSON.stringify(orderInfo.cart));
                                                        tmpArr[index].quantity = parseInt(tmpArr[index].quantity) + 1
                                                        orderInfo.setCart(tmpArr)
                                                    }
                                                }}
                                            >
                                                <span style={orderProduct.quantity >= 99 ? { color: '#d2d2d2' } : { color: '#fe5000' }}>+</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className={styles.product__field}>
                                        <span className={styles.product__fieldLabel}>Sum</span>
                                        <span className={styles.product__fieldText}>{(orderProduct.price * orderProduct.quantity).toLocaleString()} $</span>
                                    </div>
                                </div>
                            </div>

                            {orderInfo.cart.length !== 1 &&
                                <div className={styles.product__removeProduct}>
                                    <div
                                        className={styles.product__removeProductButton}
                                        onClick={() => {
                                            setConfirmationModalMessage(<span>Are you sure you want to remove the {orderProduct.name}
                                                from user order  {order.name} {order.surname}?</span>);
                                            setConfirmationModalCallback(() => () => {
                                                let tmpArr = JSON.parse(JSON.stringify(orderInfo.cart));
                                                tmpArr = tmpArr.filter((cartProduct, cartIndex) => cartIndex !== index);
                                                orderInfo.setCart(tmpArr);
                                            });
                                            setIsConfirmationModalVisible(true);
                                        }}
                                    >
                                        <div />
                                    </div>
                                </div>
                            }
                        </li>
                    )}
                </ul>
            </div>

            <div className={styles.changeInfo__statuses}>
                <div className={styles.changeInfo__field}>
                    <div className={styles.changeInfo__label}><span>Order status</span></div>
                    <select
                        className={styles.changeInfo__select}
                        value={orderInfo.orderStatus}
                        onInput={e => orderInfo.setOrderStatus(e.target.value)}
                    >
                        {!orderInfo.orderStatus && <option value={0}></option>}
                        {statuses.map(option =>
                            <option key={option.id} value={option.id}>{option.name}</option>
                        )}
                    </select>
                </div>
            </div>

            <div className={styles.changeInfo__bottom}>
                <div className={styles.changeInfo__buttons}>
                    <button
                        className={
                            (orderInfo.nameCheck.length !== 0 || orderInfo.surnameCheck.length !== 0
                                || orderInfo.mobileNumCheck.length !== 0 || !orderInfo.selectedCompany
                                || !orderInfo.selectedCity || !orderInfo.selectedDepartment
                                || !orderInfo.paymentOption)
                                ? `${styles.changeInfo__saveButton} ${styles.changeInfo__saveButtonNotActive}`
                                : styles.changeInfo__saveButton
                        }
                        onClick={() => changeAndShowCategory()}
                    >
                        Save
                    </button>
                    <button
                        className={styles.changeInfo__cancelButton}
                        onClick={() => setIsOrderChanging(false)}
                    >
                        Cancel
                    </button>
                </div>

                <div className={styles.changeInfo__totalSum}>
                    <span>Payable:</span>
                    <span>
                        {function () {
                            let totalSum = 0;
                            orderInfo.cart.map(orderProduct => {
                                totalSum += orderProduct.price * orderProduct.quantity;
                            });
                            return totalSum.toLocaleString() + ' $';
                        }()}
                    </span>
                </div>
            </div>
            <ConfirmationModal
                isVisible={isConfirmationModalVisible}
                setIsVisible={setIsConfirmationModalVisible}
                message={confirmationModalMessage}
                callback={confirmationModalCallback}
            />
        </div>
    );
});

export default AdminChangeOrder;