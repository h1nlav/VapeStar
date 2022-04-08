import { observer } from 'mobx-react-lite';
import React, { useContext, useEffect, useState } from 'react';
import { Context } from '../../..';
import { deleteCart } from '../../../api/cartApi';
import { createOrder } from '../../../api/orderApi';
import styles from './CheckoutTotal.module.css';

const CheckoutTotal = observer(({ deliveryInfo, paymentOptions, setIsOrderCreated }) => {
    const { auth, order } = useContext(Context);

    const [cartQuantity, setCartQuantity] = useState('');
    const [cartPrice, setCartPrice] = useState('');

    useEffect(() => {
        let tоtalQuantity = 0;
        let totalPrice = 0;
        order.cart.map(product => {
            tоtalQuantity += product.quantity;
            totalPrice += product.productPrice * product.quantity;
        });
        setCartQuantity(tоtalQuantity + ' products worth');
        setCartPrice(totalPrice.toLocaleString() + ' $');
    }, [order.cart])

    const makeOrderAttempt = async () => {
        !order.name && order.setName('');
        !order.surname && order.setSurname('');
        !order.mobileNum && order.setMobileNum('');
        !order.selectedCompany && order.setSelectedCompanyCheck('This field is required');
        (order.selectedCompany && !order.selectedCity) && order.setSelectedCityCheck('This field is required');
        (order.selectedCompany && order.selectedCity && !order.selectedDepartment) && order.setSelectedDepartmentCheck('This field is required');

        if (order.nameCheck.length === 0 && order.surnameCheck.length === 0
            && order.mobileNumCheck.length === 0 && order.selectedCompanyCheck.length === 0
            && order.selectedCityCheck.length === 0 && order.selectedDepartmentCheck.length === 0) {

            let normalizedMobileNum = order.mobileNum;
            if (normalizedMobileNum.startsWith('+')) normalizedMobileNum = normalizedMobileNum.split('+').pop();
            if (normalizedMobileNum.startsWith('38')) normalizedMobileNum = normalizedMobileNum.split('38').pop();

            let companyName = deliveryInfo[order.selectedCompany].companyName;
            let cityName = deliveryInfo[order.selectedCompany].cities[order.selectedCity].cityName;
            let departmentName = deliveryInfo[order.selectedCompany].cities[order.selectedCity].departments[order.selectedDepartment].name;
            let departmentAdress = deliveryInfo[order.selectedCompany].cities[order.selectedCity].departments[order.selectedDepartment].adress;
            let paymentOptionName;
            Promise.all(paymentOptions.map(paymentOption => {
                if (paymentOption.id === order.paymentOption) paymentOptionName = paymentOption.name;
            }));

            await createOrder({
                name: order.name,
                surname: order.surname,
                mobileNum: normalizedMobileNum,
                companyName,
                cityName,
                departmentName: `${departmentName}. ${departmentAdress}`,
                paymentOptionName,
                userId: auth.user.id,
                deliveryDepartmentId: order.selectedDepartment,
                paymentOptionId: order.paymentOption,
                cart: order.cart
            }).then(async () => {
                setIsOrderCreated(true);
                await deleteCart(auth.user.id);
                order.setCart([]);
            })
        }
    }

    return (
        <div className={styles.checkoutTotal}>
            <div className={styles.checkoutTotal__name}>Total</div>

            <div className={styles.checkoutTotal__row}>
                <span className={styles.checkoutTotal__label}>{cartQuantity}</span>
                <span className={styles.checkoutTotal__value}>{cartPrice}</span>
            </div>
            <div className={styles.checkoutTotal__row}>
                <span className={styles.checkoutTotal__label}>Shipping cost</span>
                <span className={styles.checkoutTotal__value}>according to the carrier's tariffs</span>
            </div>

            <div className={styles.checkoutTotal__row}>
                <span className={styles.checkoutTotal__label}>Payable</span>
                <span className={styles.checkoutTotal__value}>{cartPrice}</span>
            </div>

            <button
                className={styles.checkoutTotal__button}
                onClick={() => makeOrderAttempt()}
            >
                <span>
                    Заказ подтверждаю
                </span>
            </button>
        </div>
    );
});

export default CheckoutTotal;