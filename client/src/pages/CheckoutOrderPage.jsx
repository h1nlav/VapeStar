import { observer } from 'mobx-react-lite';
import React, { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Context } from '..';
import { getOrderDeliveryInfo, getAllPaymentOptions } from '../api/deliveryApi';
import { MAIN_ROUTE } from '../router/consts';
import OrderUserInfo from '../components/CheckoutOrderPage/OrderUserInfo/OrderUserInfo';
import OrderProducts from '../components/CheckoutOrderPage/OrderProducts/OrderProducts';
import OrderDelivery from '../components/CheckoutOrderPage/OrderDelivery/OrderDelivery';
import OrderPayment from '../components/CheckoutOrderPage/OrderPayment/OrderPayment';
import CheckoutTotal from '../components/CheckoutOrderPage/CheckoutTotal/CheckoutTotal';
import CatalogLoader from '../components/Loaders/CatalogLoader/CatalogLoader';
import styles from '../css/CheckoutOrder.module.css';

const CheckoutOrderPage = observer(() => {
    const { auth, order } = useContext(Context);
    const navigate = useNavigate();

    const [isOrderCreated, setIsOrderCreated] = useState(false);
    useEffect(() => {
        !isOrderCreated && order.cart.length === 0 && navigate(MAIN_ROUTE);
    }, [isOrderCreated, order.cart]);

    useEffect(() => {
        if (auth.isAuth) {
            order.setName(auth.user.name);
            order.setSurname(auth.user.surname);
            order.setMobileNum(auth.user.mobileNum);
        }
    }, [auth.isAuth]);

    const [deliveryInfo, setDeliveryInfo] = useState([]);
    const [paymentOptions, setPaymentOptions] = useState([]);
    const [isPageLoading, setIsPageLoading] = useState(true);
    useEffect(async () => {
        setIsPageLoading(true);
        await getOrderDeliveryInfo().then(data => setDeliveryInfo(data));
        await getAllPaymentOptions()
            .then(data => {
                setPaymentOptions(data);
                order.setPaymentOption(data[0].id)
            });

        order.clearSelectedCompany();
        order.clearSelectedCity();
        order.clearSelectedDepartment();
        setIsPageLoading(false);
    }, []);

    if (isOrderCreated) return (
        <div className={styles.orderCreated}>
            <div className={styles.orderCreated__content}>
                <div className={styles.orderCreated__icon} />
                <h1 className={styles.orderCreated__header}>Order successfully created</h1>
                <span className={styles.orderCreated__text}>The manager will contact you shortly</span>
                <Link to={MAIN_ROUTE}>
                    <button className={styles.orderCreated__button}>
                        <span>To Home Page</span>
                    </button>
                </Link>
            </div>
        </div>
    )
    return (
        <div className={styles.checkout}>
            <h1 className={styles.checkout__header}>Checkout</h1>
            <div className={styles.checkout__content}>
                <section className={styles.checkout__leftContent}>
                    <OrderUserInfo />
                    <OrderProducts />
                    <OrderDelivery deliveryInfo={deliveryInfo} />
                    <OrderPayment paymentOptions={paymentOptions} />
                </section>
                <section className={styles.checkout__rightContent}>
                    <CheckoutTotal deliveryInfo={deliveryInfo} paymentOptions={paymentOptions} setIsOrderCreated={setIsOrderCreated} />
                </section>
            </div>
            <CatalogLoader isVisible={isPageLoading} />
        </div>
    );
});

export default CheckoutOrderPage;