import React, { useState } from 'react';
import OrderStore from '../../../../store/OrderStore';
import OrderProduct from '../../../CheckoutOrderPage/OrderProduct/OrderProduct';
import FullInfoField from '../../../UI/FullInfoField/FullInfoField';
import ShortInfoContainer from '../../../UI/ShortInfoContainer/ShortInfoContainer';
import AdminChangeOrder from '../AdminChangeOrder/AdminChangeOrder';
import styles from './AdminOrder.module.css'

const AdminOrder = ({ order, fetchAndShowOrders, statuses, deliveryInfo, paymentOptions }) => {
    const [isOrderOpened, setIsOrderOpened] = useState(false);
    const [isOrderChanging, setIsOrderChanging] = useState(false);

    const createAdminInfoСhangable = () => {
        const orderInfo = new OrderStore();
        orderInfo.setName(order.name);
        orderInfo.setSurname(order.surname);

        let mobileNum = '+38' + order.mobileNum;
        mobileNum = mobileNum.slice(0, 4) + ' ' + mobileNum.slice(4, 6) + ' '
            + mobileNum.slice(6, 9) + ' ' + mobileNum.slice(9, 11) + ' ' + mobileNum.slice(11, 13);
        orderInfo.setMobileNum(mobileNum);

        let selectedCompany = null;
        let selectedCity = null
        let selectedDepartment = null;

        if (order.delivery_department && order.delivery_department.delivery_company
            && order.delivery_department.delivery_company.id) {
            selectedCompany = order.delivery_department.delivery_company.id;

            if (order.delivery_department && order.delivery_department.delivery_city.id
                && order.delivery_department.delivery_city.id) {
                selectedCity = order.delivery_department.delivery_city.id;
                if (order.delivery_department && order.delivery_department.id) selectedDepartment = order.delivery_department.id;
            }
        }

        let paymentOption = null;
        if (order.payment_option && order.payment_option.id) paymentOption = order.payment_option.id;

        orderInfo.setSelectedCompany(selectedCompany);
        orderInfo.setSelectedCity(selectedCity);
        orderInfo.setSelectedDepartment(selectedDepartment);
        orderInfo.setPaymentOption(paymentOption);
        orderInfo.setOrderStatus(order.orders_status.id || 1);
        orderInfo.setCart(order.orders_products);
        return orderInfo;
    }

    return (
        <li className={styles.order}>

            <ShortInfoContainer
                id={`№ ${order.id}`}
                isOpened={isOrderOpened}
                onClick={() => setIsOrderOpened(!isOrderOpened)}
            >
                <div className={styles.shortInfo__name}>{order.name} {order.surname}</div>
                <div className={styles.shortInfo__mobileNum}>{order.mobileNum}</div>
                <div
                    className={styles.shortInfo__status}
                    style={{ background: order.orders_status.color ? `${order.orders_status.color}` : '#ffffff' }}
                >
                    <span>{order.orders_status.name}</span>
                </div>
            </ShortInfoContainer>

            {isOrderOpened &&
                <div className={styles.order__opened}>
                    {isOrderChanging
                        ?
                        <AdminChangeOrder
                            order={order}
                            orderInfo={createAdminInfoСhangable()}
                            fetchAndShowOrders={fetchAndShowOrders}
                            setIsOrderChanging={setIsOrderChanging}
                            statuses={statuses}
                            deliveryInfo={deliveryInfo}
                            paymentOptions={paymentOptions}
                        />
                        :
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
                                <button
                                    className={styles.fullInfo__editButton}
                                    onClick={() => setIsOrderChanging(!isOrderChanging)}
                                >
                                    Edit
                                </button>

                                <div className={styles.fullInfo__totalSum}>
                                    <span>Payable:</span>
                                    <span>
                                        {function () {
                                            let totalSum = 0;
                                            order.orders_products.map(orderProduct => {
                                                totalSum += orderProduct.price * orderProduct.quantity;
                                            });
                                            return totalSum.toLocaleString() + ' $';
                                        }()}
                                    </span>
                                </div>
                            </div>
                        </div>
                    }
                </div>
            }
        </li>
    );
};

export default AdminOrder;