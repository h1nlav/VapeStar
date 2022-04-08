import { observer } from 'mobx-react-lite';
import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Context } from '../../..';
import { PRODUCT_ROUTE } from '../../../router/consts';
import CartModal from '../../Modals/CartModal/CartModal/CartModal';
import OrderProduct from '../OrderProduct/OrderProduct';
import styles from './OrderProducts.module.css';

const OrderProducts = observer(() => {
    const { order } = useContext(Context);

    const [isCartModalVisible, setIsCartModalVisible] = useState(false);
    useEffect(() => {
        order.cart.length === 0 && setIsCartModalVisible(false);
    }, [order.cart]);

    return (
        <div className={styles.orderProducts}>
            <div className={styles.orderProducts__sectionNumber}>2</div>
            <div className={styles.orderProducts__content}>
                <div className={styles.header}>
                    <span className={styles.header__text}>Selected products</span>
                    <div
                        className={styles.header__edit}
                        onClick={() => setIsCartModalVisible(true)}
                    >
                        <div />
                        <span>Edit</span>
                    </div>
                </div>

                <ul className={styles.orderProducts__productList}>
                    {order.cart.map(product =>
                        <OrderProduct key={product.productId} product={product} />
                    )}
                </ul>
            </div>
            <CartModal isVisible={isCartModalVisible} closeModal={() => setIsCartModalVisible(false)} />
        </div>
    );
});

export default OrderProducts;