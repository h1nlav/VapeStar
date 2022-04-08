import React, { useEffect, useState } from 'react';
import convertDbDate from '../../../../utils/convertDbDate';
import OrderProduct from '../../../CheckoutOrderPage/OrderProduct/OrderProduct';
import FullInfoField from '../../../UI/FullInfoField/FullInfoField';
import ShortInfoContainer from '../../../UI/ShortInfoContainer/ShortInfoContainer';
import styles from './UserOrder.module.css';

const UserOrder = ({ order }) => {
    const [totalPrice, setTotalPrice] = useState(0);
    useEffect(() => {
        let totalSum = 0;
        order.orders_products.map(orderProduct => {
            totalSum += orderProduct.price * orderProduct.quantity;
        });
        setTotalPrice(totalSum.toLocaleString() + ' $');
    }, [order.orders_products]);

    const [isOrderOpened, setIsOrderOpened] = useState(false);

    return (
        <li className={styles.order}>
            <ShortInfoContainer
                id={`№ ${order.id}`}
                isOpened={isOrderOpened}
                onClick={() => setIsOrderOpened(!isOrderOpened)}
            >
                <div className={styles.shortInfo__date}>{convertDbDate(order.createdAt)}</div>
                <div className={styles.shortInfo__totalPrice}>{totalPrice}</div>
                <div
                    className={styles.shortInfo__status}
                    style={{ background: `${order.orders_status.color}` }}
                >
                    <span>{order.orders_status.name}</span>
                </div>
            </ShortInfoContainer>


            {isOrderOpened &&
                <div className={styles.fullInfo}>
                    <div className={styles.fullInfo__fields}>
                        <FullInfoField fieldName={'Customer name'} fieldValue={order.name} />
                        <FullInfoField fieldName={'Customer surname'} fieldValue={order.surname} />
                        <FullInfoField fieldName={'Customer phone number'} fieldValue={order.mobileNum} />
                        <FullInfoField fieldName={'Delivery city'} fieldValue={order.cityName} />
                        <FullInfoField fieldName={'Delivery service'} fieldValue={order.companyName} />
                        <FullInfoField fieldName={'Delivery department'} fieldValue={order.departmentName} />
                        <FullInfoField fieldName={'Payment method'} fieldValue={order.paymentOptionName} />
                        <FullInfoField fieldName={'Order status'} fieldValue={order.orders_status.name} />
                    </div>

                    <div className={styles.productList}>
                        <div className={styles.productList__label}><span>Order</span></div>

                        <ul className={styles.productList__products}>
                            {order.orders_products.map(cart =>
                                <OrderProduct key={cart.id} product={{
                                    productId: cart.productId,
                                    productName: cart.name,
                                    productPic: cart.fileName,
                                    productPrice: cart.price,
                                    quantity: cart.quantity,
                                }} />
                            )}
                        </ul>
                    </div>

                    <div className={styles.fullInfo__bottom}>
                        <div />
                        <div className={styles.fullInfo__totalSum}>
                            <span>Payable:</span>
                            <span>{totalPrice}</span>
                        </div>
                    </div>
                </div>
            }
        </li >
    );
};

export default UserOrder;